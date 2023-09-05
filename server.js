// Loads App configuration
require('dotenv').config()

const express = require('express')

// initializing database models
const models = require('./models')

// Initializing logger class
const logger = require('./lib/logger')

// ROUTE HANDLER for all entities
const user = require('./routes/user')
const admin = require('./routes/admin')

// Default PORT is set to 8080. 
const PORT = process.env.APPLICATION_PORT || 8080

// Initializing express app
const app = express()

// Express Helper middlewares to parse incoming request data
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// user API's
app.use("/api/user", user);

// admin API's
app.use("/api/admin", admin);

// Set 404 error code for routes not availalble
app.use("*", (req, res) => res.status(404).send("Route not found"))

// Starting the app server
app.listen(PORT, () => {
    logger.info(`SERVER IS RUNNING ON PORT ${PORT}`)
});