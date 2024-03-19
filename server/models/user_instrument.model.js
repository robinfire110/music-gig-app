module.exports = (sequelize, Sequelize, User, Instrument) => {
  const UserInstrument = sequelize.define("UserInstrument", {
    user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: User,
        key: "user_id",
      },
    },
    instrument_id: {
      type: Sequelize.INTEGER,
      references: {
        model: Instrument,
        key: "instrument_id",
      },
    },
  });
  return UserInstrument;
};
