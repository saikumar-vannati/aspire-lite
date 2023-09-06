'use strict';

const userService = require('../services/user');

const { createToken, responseFormatter } = require('../lib/utilities');
const logger = require('../lib/logger');

// User signup API
exports.signup = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const user = await userService.getUserDetails({ username });

        if (user) return res.status(400).send(responseFormatter("", "User exists")); 

        await userService.createUser(username, password)

        return res.status(201).send(responseFormatter("User created", ""))
        
    } catch (err) {

        logger.error(err);
        return res.status(500).send(responseFormatter("", "Internal Server Error"))
    }
}

// User Login API
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await userService.getUserDetails({ username, password });

        if (!user) return res.status(401).send(responseFormatter("", "Bad Credentials"));

        // If user is valid, create a token and share it with user.
        const token = await createToken({
            id: user.id,
            username: user.username
        });
        
        return res.status(200).send(responseFormatter("User Logged in", "", { token }))

    } catch (err) {

        logger.error(err);
        return res.status(500).send(responseFormatter("", "Internal Server Error"))
    }
}