module.exports = (sequelize,Sequelize) => {
  const Event = sequelize.define('Event', {
    // Model attributes are defined here
    event_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    event_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    date_posted: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    start_time: {
      type: Sequelize.DATE,
      allowNull: false
    },
    end_time: {
      type: Sequelize.DATE,
      allowNull: false
    },
    pay: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      defaultValue: ""
    },
    event_hours: {
      type: Sequelize.FLOAT
    },
    rehearse_hours: {
      type: Sequelize.FLOAT,
      defaultValue: 0.0
    },
    mileage_pay: {
      type: Sequelize.FLOAT,
      defaultValue: 0.0
    },
    is_listed: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  });

  Event.findByEventIds = async function(eventIds) {
    try {
      return await Event.findAll({
        where: {
          event_id: eventIds
        }
      });
    } catch (error) {
      throw new Error('Error retrieving events by event_ids: ' + error.message);
    }
  };
  
  return Event;
};
