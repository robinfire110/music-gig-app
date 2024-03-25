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

  UserStatus.findByUserId = async function(userId) {
    try {
      const userStatuses = await UserStatus.findAll({
        attributes: ['event_id'],
        where: {
          user_id: userId
        },
        raw: true
      });
      return userStatuses.map(status => status.event_id);
    } catch (error) {
      throw new Error('Error retrieving events by user_id: ' + error.message);
    }
  };

  return UserStatus;
};
