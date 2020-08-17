"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Contents extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Contents.belongsTo(models.Users, {
        foreignKey: "fk_userId",
        as: "contents",
      });
      models.Contents.hasMany(models.Comments, {
        foreignKey: "fk_contentId",
        as: "commentsContent",
      });
      models.Contents.belongsToMany(models.Tags, {
        foreignKey: "contentId",
        through: "contentTags",
        as: "tags",
      });
    }
  }
  Contents.init(
    {
      title: DataTypes.STRING,
      content: DataTypes.STRING,
      referenceFile: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Contents",
    }
  );

  return Contents;
};
