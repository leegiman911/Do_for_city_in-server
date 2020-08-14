"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Tags extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Tags.belongsToMany(models.Users, {
        foreignKey: "tagId",
        through: "userTags",
        as: "users",
      });
      models.Tags.belongsToMany(models.Contents, {
        foreignKey: "tagId",
        through: "contentTags",
        as: "contents",
      });
    }
  }
  Tags.init(
    {
      tag: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Tags",
    }
  );
  return Tags;
};
