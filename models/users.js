"use strict";
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
      sequelize,
      modelName: "Users",
    }
  );

  return Users;
};
