"use strict";
const crypto = require("crypto");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Users.hasMany(models.Contents, {
        foreignKey: "fk_userId",
        as: "contents",
        // onDelete: "cascade",
      });
      models.Users.hasMany(models.Comments, {
        foreignKey: "fk_userId",
        as: "comments",
        // onDelete: "cascade",
      });
      models.Users.belongsToMany(models.Tags, {
        foreignKey: "userId",
        through: "userTags",
        as: "tags",
      });
    }
  }
  Users.init(
    {
      userId: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      photo: DataTypes.STRING,
    },
    {
      hooks: {
        afterValidate: (data, options) => {
          let secret1 = "도시인화이팅";
          const hash = crypto.createHmac("sha1", secret1);
          hash.update(data.password);
          // console.log("전", data.password);
          data.password = hash.digest("hex");
          // console.log("후", data.password);
        },
      },
      sequelize,
      modelName: "Users",
    }
  );

  return Users;
};

// class User extends Model {}
// User.init({
//   username: DataTypes.STRING,
//   mood: {
//     type: DataTypes.ENUM,
//     values: ['happy', 'sad', 'neutral']
//   }
// }, {
//   hooks: {
//     beforeValidate: (user, options) => {
//       user.mood = 'happy';
//     },
//     afterValidate: (user, options) => {
//       user.username = 'Toni';
//     }
//   },
//   sequelize
// });
