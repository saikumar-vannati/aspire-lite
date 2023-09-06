/**
 * Added tests for Utilities
 */

const { test } = require("node:test")
const assert = require("assert")

const utilities = require('../lib/utilities');

test("Test Split Equated Installments", async (t) => {

    let equated = utilities.equatedInstallments(500, 2)
    assert.ok(equated, "Should return list of equated installments")
    assert.deepEqual(equated, [250, 250], "Should be list of equated installments")

    equated = utilities.equatedInstallments(100000, 3)
    assert.ok(equated, "Should return list of equated installments")
    assert.deepEqual(equated, [33333, 33333, 33334], `Should be list of equated installments except last element
        in the list`)
});

test("Test JWT helper", async (t) => {

    process.env.SECRET_KEY = "random_key_123456789011121314151671181920"

    await t.test("Test createToken", async (t) => {

        const payload = {
            id: 1,
            type: 1
        }
        const token = await utilities.createToken(payload)
        assert.ok(token, "Should return a valid JWT signed token");

        const decoded = await utilities.verifyToken(token)
        assert.ok(decoded, "Should return a valid decoded object")
        assert.equal(decoded.id, 1, "Id of the decoded token should be equal to 1")
        assert.equal(decoded.type, 1, "type of the decoded token should be 1 i.e, customer")
    })

    await t.test("Test ValidateToken", async (t) => {

        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidHlwZSI6MSwiaWF0IjoxNjkzODE4NTU3fQ.SHQanyFUZgzKcP5YKNgZSmX-8pLtKH7YIaF2NxrJnyk"
        const decoded = await utilities.verifyToken(token)
        assert.ok(decoded, "Should return a valid decoded object")
        assert.equal(decoded.id, 1, "Id of the decoded token should be equal to 1")
        assert.equal(decoded.type, 1, "type of the decoded token should be 1 i.e, customer")
    });
})

test("Test Hash Generation", async (t) => {

    let hash1  = utilities.generateHash("SOMERANDOMDATA");
    let hash2  = utilities.generateHash("SOMERANDOMDATA");

    assert.equal(hash1 == hash2, true, "Should return same hash for same data");

    let hash3 = utilities.generateHash("ANOTHER DATA");
    assert.equal(hash1 == hash3, false, "Should return different hash for different data");
})

test("Test Respons Formatter", async (t) => {

    let response = utilities.responseFormatter("User created");
    assert.ok(response, "Response should be an object");
    assert.equal(response.message, "User created");
    assert.equal(response.error, "");
})