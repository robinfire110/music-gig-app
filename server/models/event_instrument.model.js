module.exports = (sequelize, Sequelize) => {
  const EventInstrument = sequelize.define("event_instrument", {
    event_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    instrument_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });
  return EventInstrument;
};
