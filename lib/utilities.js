const { createHash } = require('crypto')
const jwt = require('jsonwebtoken');


/**
 * 
 * @param {*} data Payload to be hashed
 * @returns sha256 hash of the given payload
 */
exports.generateHash =  (data) => {

    const hash = createHash('sha256');

    hash.update(data);
    return hash.digest('hex')
}

/**
 * 
 * @param {*} message Success message for response
 * @param {*} error Error message
 * @param {*} data Data to be sent
 * @returns formatted respons object
 */
exports.responseFormatter = (message = "", error = "", data = {}) => {
    return { message, error, data }
}

/**
 * 
 * @param {*} payload | payload for creating the token
 * @returns JWT token
 * 
 * This function creates a JWT token by siging it with secret key
 * using HS256 algo
 */
exports.createToken = (payload) => {

    return new Promise((resolve, reject) => {

        jwt.sign(payload, process.env.SECRET_KEY, { algorithm: 'HS256' }, function(err, token) {
            
            if (err) return reject(err);
            
            return resolve(token);
        });
    })
}

/**
 * 
 * @param {*} token JWT token passed in the authorization headers
 * @returns decoded payload
 * 
 * This function verifies and decodes the incoming JWT token
 */
exports.verifyToken = (token) => {
    return new Promise((resolve, reject) => {

        jwt.verify(token, process.env.SECRET_KEY, { algorithms: 'HS256' }, function(err, decoded) {
            
            return resolve(decoded)
        });
    })
}

/**
 * 
 * @param {*} amount total amount
 * @param {*} term Number of payment installments
 * @returns List of equated monthly installments
 * 
 * Make Sure amount is multiplied by 10^4 to avoid decimal calculations
 * This should save memory in database
 */
exports.splitLoanAmount = (amount, term) => {

    let termAmounts = [];
    let termAmount = Math.floor(amount / term);
    let totalTermAmount = 0
    for (let i = 1; i <= term; i++) {
        let currentTermAmount = termAmount;
        if (i == term) {
            currentTermAmount = amount - totalTermAmount;
        }

        termAmounts.push(currentTermAmount);
        totalTermAmount += currentTermAmount
    }

    return termAmounts;
}