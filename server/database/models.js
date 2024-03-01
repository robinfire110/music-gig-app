const {DataTypes, Sequelize} = require('sequelize');
const {sequelize} = require('./database');

/* User */
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
  }
});

/* Event */
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
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    pay: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    event_hours: {
      type: DataTypes.FLOAT
    },
    rehearse_hours: {
      type: DataTypes.FLOAT
    },
    mileage_pay: {
      type: DataTypes.FLOAT,
    },
    is_listed: {
      type: DataTypes.BOOLEAN
    }
  });

  /* Event */
const Financial = sequelize.define('Financial', {
  // Model attributes are defined here
  fin_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fin_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: Sequelize.NOW
  },
  total_wage: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  hourly_wage: {
    type: DataTypes.FLOAT
  },
  event_hours: {
    type: DataTypes.FLOAT
  },
  rehearse_hours: {
    type: DataTypes.FLOAT
  },
  practice_hours: {
    type: DataTypes.FLOAT
  },
  total_mileage: {
    type: DataTypes.FLOAT,
  },
  mileage_pay: {
    type: DataTypes.FLOAT,
  },
  zip: {
    type: DataTypes.STRING
  },
  gas_price: {
    type: DataTypes.FLOAT
  },
  mpg: {
    type: DataTypes.FLOAT
  },
  tax: {
    type: DataTypes.FLOAT
  },
  fees: {
    type: DataTypes.FLOAT
  },
});

/* Address */
const Address = sequelize.define('Address', {
  // Model attributes are defined here
  address_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  street: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  zip: {
    type: DataTypes.STRING,
    allowNull: false
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false
  },
});

/* Instrument */
const Instrument = sequelize.define('Instrument', {
    // Model attributes are defined here
    name: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    }
  });

/* Set Foreign Keys */
//Create their own tables to make sure they get named properly and so we get more control over them.
/* UserStatus */
const UserStatus = sequelize.define("UserStatus", {
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "user_id"
    }
  },
  event_id:{
    type: DataTypes.INTEGER,
    references: {
      model: Event,
      key: "event_id"
    }
  }
});

//Creates UserStatus table
User.belongsToMany(Event, {through: "UserStatus", foreignKey: "user_id", foreignKeyConstraint: true, sourceKey: "user_id"});
Event.belongsToMany(User, {through: "UserStatus", foreignKey: "event_id", foreignKeyConstraint: true, sourceKey: "event_id"});

/* FinStatus */
//Creates FinStatus table
User.belongsToMany(Financial, {through: "FinStatus", foreignKey: "user_id", foreignKeyConstraint: true, sourceKey: "user_id"});
Financial.belongsToMany(User, {through: "FinStatus", foreignKey: "fin_id", foreignKeyConstraint: true, sourceKey: "fin_id"});

/* Address with Event */

Address.hasOne(Event, {foreignKey: "address_id", foreignKeyConstraint: true});
Event.belongsTo(Address, {foreignKey: "event_id", foreignKeyConstraint: true});

//Export Models
module.exports = {User, Event, Financial, Address, Instrument};
