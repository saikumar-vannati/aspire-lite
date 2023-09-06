/**
 * Added Tests for authentication middleware
 */

const t = require('tap')
const { mock } = require('node:test')
const assert = require('assert');

t.test("Testing Authenticator Middleware", async (t) => {

    t.test("Testing Successful authentication", async (t) => {

        // Mocking user models
        const { authenticate } = t.mock('../middlewares/authenticate', {
            '../services/user': { getUserDetails: () => {
                return {
                    id: 1,
                    username: "saikumar.vannati",
                    password: "some-rand-string"
                }}
            }
        });

        process.env.SECRET_KEY = "random_key_123456789011121314151671181920"
        const req = {
            headers: {
                authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidHlwZSI6MSwiaWF0IjoxNjkzODE4NTU3fQ.SHQanyFUZgzKcP5YKNgZSmX-8pLtKH7YIaF2NxrJnyk"
            }
        }
        const res = {};
        const next = mock.fn((a, b) => {});

        await authenticate(req, res, next)

        assert.strictEqual(next.mock.calls.length, 1, "next() method should be called after successful authentication");
        t.end();
    });

    t.test("Testing 401 unauthorized - No token provided", async (t) => {

        // Mocking user models
        const { authenticate } = t.mock('../middlewares/authenticate', {
            '../services/user': { getUserDetails: () => {
                return {
                    id: 1,
                    username: "saikumar.vannati",
                    password: "some-rand-string"
                }}
            }
        });

        process.env.SECRET_KEY = "random_key_123456789011121314151671181920"
        const req = {
            headers: {}
        }

        const res = {};
        res.status = mock.fn((status) => {
            return {
                send: (message, error, data) => {}
            }
        });
        
        const next = () => {}

        await authenticate(req, res, next)
        assert.strictEqual(res.status.mock.calls.length, 1, "res.status() method should be called");
        assert.deepEqual(res.status.mock.calls[0].arguments, [401], "Should be 401 unauthorized status");
        t.end();
    });

    t.test("Testing 401 unauthorized - Invalid JWT provided", async (t) => {

        // Mocking user models
        const { authenticate } = t.mock('../middlewares/authenticate', {
            '../services/user': { getUserDetails: () => {
                return {
                    id: 1,
                    username: "saikumar.vannati",
                    password: "some-rand-string"
                }}
            }
        });

        process.env.SECRET_KEY = "random_key_123456789011121314151671181920"
        const req = {
            headers: {
                authorization: "invalid jwt token is passed"
            }
        }

        const res = {};
        res.status = mock.fn((status) => {
            return {
                send: (message, error, data) => {}
            }
        });
        
        const next = () => {}

        await authenticate(req, res, next)
        assert.strictEqual(res.status.mock.calls.length, 1, "res.status() method should be called");
        assert.deepEqual(res.status.mock.calls[0].arguments, [401], "Should be 401 unauthorized status");
        t.end();
    });

    t.test("Testing 403 Forbidden - Invalid User", async (t) => {

        // Mocking user models
        const { authenticate } = t.mock('../middlewares/authenticate', {
            '../services/user': { getUserDetails: () => {
                    return null
                }
            }
        });

        process.env.SECRET_KEY = "random_key_123456789011121314151671181920"
        const req = {
            headers: {
                authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidHlwZSI6MSwiaWF0IjoxNjkzODE4NTU3fQ.SHQanyFUZgzKcP5YKNgZSmX-8pLtKH7YIaF2NxrJnyk"
            }
        }

        const res = {};
        res.status = mock.fn((status) => {
            return {
                send: (message, error, data) => {}
            }
        });
        
        const next = () => {}

        await authenticate(req, res, next)
        assert.strictEqual(res.status.mock.calls.length, 1, "res.status() method should be called");
        assert.deepEqual(res.status.mock.calls[0].arguments, [403], "Should be 403 - access denied");
        t.end();
    });

});