module.exports = (sequelize, Sequelize, User, FinStatus) => {
  const Financial = sequelize.define("financial", {
    fin_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fin_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    date: {
      type: Sequelize.DATEONLY,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    total_wage: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    event_hours: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    hourly_wage: {
      type: Sequelize.FLOAT,
      defaultValue: 0.0,
    },
    rehearse_hours: {
      type: Sequelize.FLOAT,
      defaultValue: 0.0,
    },
    practice_hours: {
      type: Sequelize.FLOAT,
      defaultValue: 0.0,
    },
    total_mileage: {
      type: Sequelize.FLOAT,
      defaultValue: 0.0,
    },
    mileage_pay: {
      type: Sequelize.FLOAT,
      defaultValue: 0.0,
    },
    zip: {
      type: Sequelize.STRING,
    },
    gas_price: {
      type: Sequelize.FLOAT,
      defaultValue: 0.0,
    },
    mpg: {
      type: Sequelize.FLOAT,
      defaultValue: 0.0,
    },
    tax: {
      type: Sequelize.FLOAT,
      defaultValue: 0.0,
    },
    fees: {
      type: Sequelize.FLOAT,
      defaultValue: 0.0,
    },
  });

  Financial.belongsToMany(User, {
    through: FinStatus,
    foreignKey: "fin_id",
    foreignKeyConstraint: true,
    sourceKey: "fin_id",
  });

  return Financial;
};
