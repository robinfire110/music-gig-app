// Exports configuring parameters for MySQL database connection and Sequelize object

module.exports = {
  HOST: process.env.DB_HOST,
  PORT: process.env.DB_PORT,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  DB: process.env.DB_NAME,
  dialect: "mysql",
  define: {
    freezeTableName: true, //Ensure table names don't get pluralized
    timestamps: false, //Removes automatic time added and updated columns
    underscored: true,
  },
};
//
// const { Sequelize } = require("sequelize");
// require("dotenv").config();
//
// let sequelize;
//
// //Set up Sequelize object and connection to database
// const local_database = new Sequelize("dev_db", "root", "password", {
//   host: "localhost",
//   dialect: "mysql",
//   define: {
//     freezeTableName: true, //Ensure table names don't get pluralized
//     timestamps: false, //Removes automatic time added and updated columns
//     underscored: true,
//   },
// });
//
// // Function to connect to the database
// const remote_database = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialect: process.env.DB_CONNECTION,
//     define: {
//       freezeTableName: true,
//       timestamps: false,
//       underscored: true,
//     },
//   },
// );
//
// //Select if you want to use local_sequelize or db_sequelize
// sequelize = remote_database;
//
// //Connect to database
// const connectToDatabase = async () => {
//   try {
//     await sequelize.authenticate();
//     if (sequelize === local_database)
//       console.log("Successfully connected to LOCAL database.");
//     else console.log("Successfully connected to REMOTE database.");
//   } catch (error) {
//     console.log(error);
//   }
//   return sequelize;
// };
//
// //Export for use in other files
// module.exports = { sequelize, connectToDatabase };
