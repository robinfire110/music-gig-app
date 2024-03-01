const {Sequelize} = require('sequelize');

//Set up Sequelize object and connection to database
const sequelize = new Sequelize(
    'dev_db',
    'root',
    'password', {
        host: 'localhost',
        dialect: "mysql",
        define: {
            freezeTableName: true, //Ensure table names don't get pluralized
            timestamps: false, //Removes automatic time added and updated columns
            underscored: true
        }
    }
)

//Connect to database
const connectToDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log("Successfully connected to database.")
    }
    catch (error) {
        console.log(error);
    }
}

//Export for use in other files
module.exports = {sequelize, connectToDatabase};
