module.exports = (sequelize, Sequelize, User, Financial) => {
  const FinStatus = sequelize.define("FinStatus", {
    user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: User,
        key: "user_id"
      }
    },
    fin_id:{
      type: Sequelize.INTEGER,
      references: {
        model: Financial,
        key: "fin_id"
      }
    }
  });

  User.belongsToMany(Financial, {
    through: FinStatus,
    foreignKey: "user_id",
    foreignKeyConstraint: true,
    sourceKey: "user_id",
  });

  Financial.belongsToMany(User, {
    through: FinStatus,
    foreignKey: "fin_id",
    foreignKeyConstraint: true,
    sourceKey: "fin_id",
  });
  return FinStatus;
};
