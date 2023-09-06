'use strict';

const models = require('../models');
const { generateHash } = require('../lib/utilities');
const { getActiveLoan } = require('./loan');

/**
 * 
 * @param {*} user user object to query the database 
 * @returns user entry
 */
exports.getUserDetails = function getUserDetails(user) {

    // Password is hashed and stored in the database.
    // Always hash the password before querying the database
    if (user.password) user.password = generateHash(user.password);

    return models.user.findOne({
        where: user,
        raw: true
    });
}

/**
 * 
 * @param {*} username username of the user
 * @param {*} password password of the user
 */
exports.createUser = async function createUser(username, password) {

    // Hashing the password
    const hashedPassword = generateHash(password);

    await models.user.create({ username, password: hashedPassword });
}

exports.hasActiveLoan = async function hasActiveLoan(userId) {

    // Get pending loan details for the user
    const userLoan = await getActiveLoan(userId);

    return userLoan.length > 0 ? true : false
}