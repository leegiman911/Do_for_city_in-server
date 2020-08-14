"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Comments.belongsTo(models.Users, {
        foreignKey: "fk_userId",
      });
      models.Comments.belongsTo(models.Contents, {
        foreignKey: "fk_contentId",
      });
    }
  }
  Comments.init(
    {
      comment: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Comments",
    }
  );
  return Comments;
};
