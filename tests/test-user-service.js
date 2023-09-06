/**
 * Added Tests for user service
 */

require('dotenv').config()
const t = require('tap')
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

    await t.test("Testing User has active loans", async (t) => {

        await t.test("user has active loan", async (t) => {

            // Mocking user with active loan
            // Returning an array of term payments
            const { hasActiveLoan } = t.mock('../services/user', {
                '../services/loan': { getActiveLoan: () => {
                        return [{ loan_id: 1, term_amount: 30, term_number: 1  }]
                    }
                }
            });

            let userId = 101;
            let hasLoan = await hasActiveLoan(userId);
            assert.equal(hasLoan, true, "User has an active loan, it should be true")
        });

        await t.test("User doesn't have active loan", async (t) => {

            // Mocking user with no loans
            // Returning an empty array of term payments
            const { hasActiveLoan } = t.mock('../services/user', {
                '../services/loan': { getActiveLoan: () => {
                        return []
                    }
                }
            });

            let userId = 101;
            let hasLoan = await hasActiveLoan(userId);
            assert.equal(hasLoan, false, "User doesn't have an active loan, it should be false")
        });
    });
})