module.exports = (sequelize, Sequelize,) => {
    const GasPrice = sequelize.define("GasPrice", {
        location: {
          type: DataTypes.STRING,
          primaryKey: true,
          allowNull: false
        },
        averagePrice: {
          type: DataTypes.FLOAT,
          allowNull: false
        },
      });

  return GasPrice;
};
