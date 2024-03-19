const dbConfig = require("../config/db.config.js");

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: dbConfig.dialect,
  define: dbConfig.define,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

const Event = db.events;

db.eventInstruments = require("./event_instrument.model.js")(
  sequelize,
  Sequelize,
);

db.users = require("./user.model.js")(
  sequelize,
  Sequelize,
  UserStatus,
  FinStatus,
  Instrument,
  Event,
  Financial,
  UserInstrument,
);
db.addresses = require("./address.model.js")(sequelize, Sequelize, Event);
db.financials = require("./financial.model.js")(
  sequelize,
  Sequelize,
  User,
  FinStatus,
);
db.events = require("./event.model.js")(
  sequelize,
  Sequelize,
  User,
  Address,
  Instrument,
  UserStatus,
  EventInstrument,
);

db.instruments = require("./instrument.model.js")(
  sequelize,
  Sequelize,
  User,
  Event,
  UserInstrument,
  EventInstrument,
);
db.userStatus = require("./user_status.model.js")(
  sequelize,
  Sequelize,
  User,
  Event,
);
db.finStatus = require("./fin_status.model.js")(
  sequelize,
  Sequelize,
  User,
  Financial,
);
db.userInstruments = require("./user_instrument.model.js")(
  sequelize,
  Sequelize,
  User,
  Instrument,
);

const User = db.users;
const Instrument = db.instruments;
const Financial = db.financials;

const UserInstrument = db.userInstruments;
const EventInstrument = db.eventInstruments;
const Address = db.addresses;
const UserStatus = db.userStatus;
const FinStatus = db.finStatus;
module.exports = db;
