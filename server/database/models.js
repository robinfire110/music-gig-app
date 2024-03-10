const {DataTypes, Sequelize} = require('sequelize');
const {sequelize} = require('./database');
const moment = require('moment');
const {faker} = require('@faker-js/faker');
const instrument = require('./instrumentList');

/* Functions */
function getRandomInt(max)
{
  return Math.floor(Math.random() * max);
}

//Import Instruments
async function importInstruments() {
  const instrumentExists = await Instrument.findOne();
  if (instrumentExists == null)
  {
      console.log("Creating instrument list.")
      instrument.instrumentList.forEach(instrument => {
          Instrument.create({name: instrument});
      }); 
  }
  else
  {
      console.log("Instrument List exists, skipping inserts.")
  }    
}

//Create faker data
async function createFakerData(userNum, eventNum, financialNum)
{
    console.log("Inserting faker data");
    //Vars
    let userIds = [];
    let instrument_count;

    //Users
    for (let i = 0; i < userNum; i++)
    {
      //Create users
      let newUser = await User.create({email: faker.internet.email(), password: faker.internet.password(), f_name: faker.person.firstName(), l_name: faker.person.lastName(), zip: faker.location.zipCode(), bio: faker.person.bio()});
      userIds.push(newUser.user_id);

      //Create instruments
      for (let j = 0; j < getRandomInt(6); j++)
      {
        try {
          await UserInstrument.findOrCreate({where: {instrument_id: getRandomInt(instrument.instrumentList.length), user_id: newUser.user_id}});
        } catch (error) {
          console.log(`Skipping - Error occured adding UserInstruments ${error}`);
        }
      }
    }

    //Events
    for (let i = 0; i < eventNum; i++)
    {
      //Create date
      let refDate = new Date().toISOString();
      let startDate = faker.date.future({refDate: refDate});
      let endDate = faker.date.soon({refDate: startDate, days: .5});
      
      //Create event
      let newEvent = await Event.create({event_name: faker.commerce.productName(), start_time: startDate, end_time: endDate, pay: (Math.random()*500).toFixed(2), event_hours: getRandomInt(7), description: faker.commerce.productDescription(), rehearse_hours: getRandomInt(4), mileage_pay: getRandomInt(25), is_listed: getRandomInt(2)});
      let newAddress = await Address.create({event_id: newEvent.event_id, street: faker.location.street(), city: faker.location.city(), zip: faker.location.zipCode(), state: faker.location.state()});
      let newStatus = await UserStatus.create({user_id: userIds[getRandomInt(userIds.length)], event_id: newEvent.event_id, status: "owner"});

      //Create instruments
      for (let j = 0; j < getRandomInt(3); j++)
      {
        try {
          await EventInstrument.findOrCreate({where: {instrument_id: getRandomInt(instrument.instrumentList.length), event_id: newEvent.event_id}});
        } catch (error) {
          console.log(`Skipping - Error occured adding EventInstruments ${error}}`);
        }
      }
    }

    //Financial
    for (let i = 0; i < financialNum; i++)
    {
      //Create users
      let newFinancial = await Financial.create({fin_name: faker.company.name(), date: faker.date.recent(), total_wage: (Math.random()*500).toFixed(2), event_hours: getRandomInt(6)});
      let newFinStatus = await FinStatus.create({user_id: userIds[getRandomInt(userIds.length)], fin_id: newFinancial.fin_id});
    }
}

async function getInstrumentId(instrument)
{
    //Get Instrument by name
    if (typeof instrument == "string")
    {
        instrumentId = (await Instrument.findOne({where: {name: instrument}}))?.instrument_id;
    }
    else
    {
        instrumentId = (await Instrument.findOne({where: {instrument_id: instrument}}))?.instrument_id;
    }
    return instrumentId;
}

function getEventHours(start_time, end_time)
{
    return (moment(end_time) - moment(start_time))/3600000;
}

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
      type: DataTypes.TEXT,
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
module.exports = {User, Event, Financial, Address, Instrument, UserStatus, FinStatus, UserInstrument, EventInstrument, 
  getInstrumentId, getEventHours, createFakerData, importInstruments};
