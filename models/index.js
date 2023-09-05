'use strict';
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");

const logger = require('../lib/logger')

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	dialect: process.env.DB_DIALECT,
	logging: logger.debug
});

const db = {};

sequelize
	.authenticate()
	.then(async () => {

		logger.info("Database connection has been established successfully.")

        await sequelize.sync()
        
	}).catch((err) => {
		logger.error("Failed to connect to the database: ", err)
	})

fs
	.readdirSync(__dirname)
	.filter((file) => {
		return (file.indexOf(".") !== 0) && (file !== "index.js") && (file !== "migrations") && (file !== "redshift-migrations");
	})
	.forEach((file) => {
		const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);

		db[model.name] = model;
	});

Object.keys(db).forEach((modelName) => {
	if ("associate" in db[modelName]) {
		db[modelName].associate(db);
	}

});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;