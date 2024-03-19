module.exports = (sequelize, Sequelize, User, Event) => {
  const UserStatus = sequelize.define("UserStatus", {
    user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: User,
        key: "user_id",
      },
    },
    event_id: {
      type: Sequelize.INTEGER,
      references: {
        model: Event,
        key: "event_id",
      },
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
  return UserStatus;
};
