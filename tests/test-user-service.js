require('dotenv').config()
const t = require('tap')
const { mock } = require('node:test')
const assert = require('assert');
const { createUser, getUserDetails } = require('../services/user')

const generateRandomString = () => {
    return Math.floor(Math.random() * Date.now()).toString(36);
};

t.test("Testing User service", async (t) => {

    await t.test("Testing User creation", async (t) => {

        let username = generateRandomString();
        let password = generateRandomString();

        await createUser(username, password);

        const userDetails = await getUserDetails({
            username: username
        })

        assert.ok(userDetails, "Should return valid user object");
    });

    await t.test("Testing fetch user details", async (t) => {

        let username = generateRandomString();
        let password = generateRandomString();

        await createUser(username, password);

        // Fetching use on username
        let userDetails = await getUserDetails({
            username: username
        })

        assert.ok(userDetails);
        assert.equal(userDetails.username, username, "Should return correct username");

        // Fetching user on username and password
        userDetails = await getUserDetails({
            username: username,
            password: password
        })

        assert.ok(userDetails);
        assert.equal(userDetails.username, username, "Should return correct username");
    });
})