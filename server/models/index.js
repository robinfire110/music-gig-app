const dbConfig = require("../config/db.config.js");

const { Sequelize } = require("sequelize");


const sequelize = new Sequelize("dev_db", "root", "password", {
  host: "localhost",
  dialect: "mysql",
  define: {
    freezeTableName: true, //Ensure table names don't get pluralized
    timestamps: false, //Removes automatic time added and updated columns
    underscored: true,
    },
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.model.js")(
  sequelize,
  Sequelize,
);

db.financials = require("./financial.model.js")(
  sequelize,
  Sequelize,
);
db.events = require("./event.model.js")(
  sequelize,
  Sequelize,
);

db.addresses = require("./address.model.js")(sequelize, Sequelize, db.events);

db.instruments = require("./instrument.model.js")(
  sequelize,
  Sequelize,
);

db.eventInstruments = require("./event_instrument.model.js")(
  sequelize,
  Sequelize,
  db.events,
  db.instruments
);

db.userStatus = require("./user_status.model.js")(
  sequelize,
  Sequelize,
  db.users,
  db.events,
);

db.finStatus = require("./fin_status.model.js")(
  sequelize,
  Sequelize,
  db.users,
  db.financials,
);

db.userInstruments = require("./user_instrument.model.js")(
  sequelize,
  Sequelize,
  db.users,
  db.instruments,
);

const User = db.users;
const Instrument = db.instruments;
const Financial = db.financials;
const Event = db.events;
const UserInstrument = db.userInstruments;
const EventInstrument = db.eventInstruments;
const Address = db.addresses;
const UserStatus = db.userStatus;
const FinStatus = db.finStatus;
module.exports = db;
