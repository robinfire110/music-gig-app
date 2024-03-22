// This sequelize model is used to define the user table in the database.
module.exports = (sequelize,Sequelize,) => {
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
  return User;
};
