const { db_sequelize, connectToDatabase } = require('./config/db');

// Function to test database connection
const testDatabaseConnection = async () => {
    try {
        // Connect to the database
        await connectToDatabase();
        console.log('Database connection successful');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        // Close the database connection
        await db_sequelize.close();
    }
};

// Call the function to test the database connection
testDatabaseConnection();