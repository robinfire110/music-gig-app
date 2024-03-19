module.exports = (sequelize, Sequelize, User, Financial) => {
  const FinStatus = sequelize.define("FinStatus", {
    user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: User,
        key: "user_id",
      },
    },
    fin_id: {
      type: Sequelize.INTEGER,
      references: {
        model: Financial,
        key: "fin_id",
      },
    },
  });
  return FinStatus;
};
