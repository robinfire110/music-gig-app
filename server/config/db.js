// server/config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Function to connect to the database
const db_sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_CONNECTION,
        define: {
            freezeTableName: true,
            timestamps: false,
            underscored: true
        }
    }
);

const connectToDatabase = async () => {
    try {
        await db_sequelize.authenticate();
        console.log("Successfully connected to database.");
    } catch (error) {
        console.log("Unable to connect to the database:", error);
        throw error;
    }

    return db_sequelize; // Return the Sequelize instance
};

module.exports = { db_sequelize, connectToDatabase };

