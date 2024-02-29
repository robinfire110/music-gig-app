const {DataTypes} = require('sequelize');
const {sequelize} = require('./database');

///User
const User = sequelize.define('User', {
  // Model attributes are defined here
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  f_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  l_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  zip: {
    type: DataTypes.STRING,
    allowNull: false
  },
  bio: {
    type: DataTypes.STRING,
    defaultValue: ""
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

}, {
  timestamps: false //Disables the date created and date updated columns
});

//Event
const Event = sequelize.define('Event', {
    // Model attributes are defined here
    event_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    event_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    pay: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    event_hours: {
      type: DataTypes.INTEGER
    },
    rehearse_hours: {
      type: DataTypes.INTEGER
    },
    mileage_pay: {
      type: DataTypes.INTEGER,
    },
    is_listed: {
      type: DataTypes.BOOLEAN
    }
  }, {
    timestamps: false //Disables the date created and date updated columns
  });

//Instrument
const Instrument = sequelize.define('Instrument', {
    // Model attributes are defined here
    name: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    }
  }, {
    timestamps: false //Disables the date created and date updated columns
  });


//Set Foreign Keys
User.belongsToMany(Instrument, {through: "InstrumentStatus"});
Instrument.belongsToMany(User, {through: "InstrumentStatus"});

//Export Models
module.exports = {User, Instrument, Event};
