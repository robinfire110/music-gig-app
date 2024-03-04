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
    date_posted: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    pay: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      defaultValue: ""
    },
    event_hours: {
      type: DataTypes.FLOAT
    },
    rehearse_hours: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0
    },
    mileage_pay: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0
    },
    is_listed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
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
  event_hours: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  hourly_wage: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0
  },
  rehearse_hours: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0
  },
  practice_hours: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0
  },
  total_mileage: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0
  },
  mileage_pay: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0
  },
  zip: {
    type: DataTypes.STRING
  },
  gas_price: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0
  },
  mpg: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0
  },
  tax: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0
  },
  fees: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0
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
    instrument_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
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
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

/* FinStatus */
const FinStatus = sequelize.define("FinStatus", {
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "user_id"
    }
  },
  fin_id:{
    type: DataTypes.INTEGER,
    references: {
      model: Financial,
      key: "fin_id"
    }
  }
});

/* UserInstrument */
const UserInstrument = sequelize.define("UserInstrument", {
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "user_id"
    }
  },
  instrument_id:{
    type: DataTypes.INTEGER,
    references: {
      model: Instrument,
      key: "instrument_id"
    }
  }
});

/* EventInstrument */
const EventInstrument = sequelize.define("EventInstrument", {
  event_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Instrument,
      key: "event_id"
    }
  },
  instrument_id:{
    type: DataTypes.INTEGER,
    references: {
      model: Instrument,
      key: "instrument_id"
    }
  }
});


/* Create Associations in Sequelize */
//Creates UserStatus table
User.belongsToMany(Event, {through: UserStatus, foreignKey: "user_id", foreignKeyConstraint: true, sourceKey: "user_id"});
Event.belongsToMany(User, {through: UserStatus, foreignKey: "event_id", foreignKeyConstraint: true, sourceKey: "event_id"});

/* FinStatus */
//Creates FinStatus table
User.belongsToMany(Financial, {through: FinStatus, foreignKey: "user_id", foreignKeyConstraint: true, sourceKey: "user_id"});
Financial.belongsToMany(User, {through: FinStatus, foreignKey: "fin_id", foreignKeyConstraint: true, sourceKey: "fin_id"});

/* Address with Event */
Event.hasOne(Address, {foreignKey: "event_id", foreignKeyConstraint: true, onDelete: 'CASCADE'});
Address.belongsTo(Event, {foreignKey: "address_id", foreignKeyConstraint: true, onDelete: 'CASCADE'});

/* UserInstrument */
User.belongsToMany(Instrument, {through: UserInstrument, foreignKey: "user_id", foreignKeyConstraint: true, sourceKey: "user_id"});
Instrument.belongsToMany(User, {through: UserInstrument, foreignKey: "instrument_id", foreignKeyConstraint: true, sourceKey: "instrument_id"});

/* EventInstrument */
Event.belongsToMany(Instrument, {through: EventInstrument, foreignKey: "event_id", foreignKeyConstraint: true, sourceKey: "event_id"});
Instrument.belongsToMany(Event, {through: EventInstrument, foreignKey: "instrument_id", foreignKeyConstraint: true, sourceKey: "instrument_id"});

//Export Models
module.exports = {User, Event, Financial, Address, Instrument, UserStatus, FinStatus, UserInstrument, EventInstrument};
