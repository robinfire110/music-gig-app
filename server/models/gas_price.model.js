module.exports = (sequelize, Sequelize,) => {
    const GasPrice = sequelize.define("GasPrice", {
        location: {
          type: Sequelize.STRING,
          primaryKey: true,
          allowNull: false
        },
        averagePrice: {
          type: Sequelize.FLOAT,
          allowNull: false
        },
      });

  return GasPrice;
};
