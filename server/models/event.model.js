const moment = require("moment");
module.exports = (
  sequelize,
  Sequelize,
  User,
  Address,
  Instrument,
  UserStatus,
  EventInstrument,
) => {
  const Event = sequelize.define("event", {
    event_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    event_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    date_posted: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    start_time: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    end_time: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    pay: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      defaultValue: "",
    },
    event_hours: {
      type: Sequelize.FLOAT,
    },
    rehearse_hours: {
      type: Sequelize.FLOAT,
      defaultValue: 0.0,
    },
    mileage_pay: {
      type: Sequelize.FLOAT,
      defaultValue: 0.0,
    },
    is_listed: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });

  Event.getEventHours = function (start_time, end_time) {
    return (moment(end_time) - moment(start_time)) / 3600000;
  };

  Event.belongsToMany(User, {
    through: UserStatus,
    foreignKey: "event_id",
    foreignKeyConstraint: true,
    sourceKey: "event_id",
  });

  Event.hasOne(Address, {
    foreignKey: "event_id",
    foreignKeyConstraint: true,
    onDelete: "CASCADE",
  });

  Event.belongsToMany(Instrument, {
    through: EventInstrument,
    foreignKey: "event_id",
    foreignKeyConstraint: true,
    sourceKey: "event_id",
  });

  return Event;
};
