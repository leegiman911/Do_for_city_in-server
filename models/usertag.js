"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class userTag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.userTag.belongsTo(models.Users, {
        foreignKey: "userId",
        as: "user",
      });
      models.userTag.belongsTo(models.Tags, {
        foreignKey: "tagId",
        as: "tag",
      });
    }
  }
  userTag.init(
    {
      tagId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "userTag",
    }
  );
  return userTag;
};
