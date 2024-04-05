const bcrypt = require('bcrypt');

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("User", {
    user_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    f_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    l_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    zip: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    bio: {
      type: Sequelize.TEXT,
      defaultValue: "",
    },
    isAdmin: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });

  //User Model functions
  User.beforeCreate(async (user, options) => {
    const saltRounds = 10;
    user.password = await bcrypt.hash(user.password, saltRounds);
  });


  User.login = async function (email, password) {
    const user = await this.findOne({ where: { email } });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        return user;
      }
      throw new Error("Incorrect Password");
    }
    throw new Error("Incorrect Email");
  };

  User.updateUser = async function (userId, newData) {
    try {
      const user = await this.findByPk(userId);
      if (user) {
        await user.update(newData);
      }
    } catch (err) {
      console.error("Error updating user:", err.message);
      throw err;
    }
  };

return User;
};

