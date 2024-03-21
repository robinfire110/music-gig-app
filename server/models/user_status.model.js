module.exports = (sequelize, Sequelize, User, Event) => {
  /* UserStatus */
  const UserStatus = sequelize.define("UserStatus", {
    user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: User,
        key: "user_id"
      }
    },
    event_id:{
      type: Sequelize.INTEGER,
      references: {
        model: Event,
        key: "event_id"
      }
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });

  User.belongsToMany(Event, {
    through: UserStatus,
    foreignKey: "user_id",
    foreignKeyConstraint: true,
    sourceKey: "user_id",
  });

  Event.belongsToMany(User, {
    through: UserStatus,
    foreignKey: "event_id",
    foreignKeyConstraint: true,
    sourceKey: "event_id",
  });

  return UserStatus;
};
