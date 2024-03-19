const { instrumentList } = require("../database/instrumentList");
module.exports = (
  sequelize,
  Sequelize,
  User,
  Event,
  UserInstrument,
  EventInstrument,
) => {
  const Instrument = sequelize.define("instrument", {
    instrument_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
    },
  });
  Instrument.importInstruments = async function () {
    const instrumentExists = await Instrument.findOne();
    if (instrumentExists == null) {
      console.log("Creating instrument list.");
      await Promise.all(
        instrumentList.map((instrument) => {
          return Instrument.create({ name: instrument });
        }),
      );
    } else {
      console.log("Instrument List exists, skipping inserts.");
    }
  };

  Instrument.getInstrumentId = async function (instrument) {
    let instrumentId;
    //Get Instrument by name
    if (typeof instrument === "string") {
      instrumentId = (await Instrument.findOne({ where: { name: instrument } }))
        ?.instrument_id;
    } else {
      instrumentId = (
        await Instrument.findOne({ where: { instrument_id: instrument } })
      )?.instrument_id;
    }
    return instrumentId;
  };

  Instrument.belongsToMany(User, {
    through: UserInstrument,
    foreignKey: "instrument_id",
    foreignKeyConstraint: true,
    sourceKey: "instrument_id",
  });

  Instrument.belongsToMany(Event, {
    through: EventInstrument,
    foreignKey: "instrument_id",
    foreignKeyConstraint: true,
    sourceKey: "instrument_id",
  });

  return Instrument;
};
