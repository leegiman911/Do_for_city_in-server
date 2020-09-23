'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class contentTag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  contentTag.init({
    tagId: DataTypes.INTEGER,
    contentId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'contentTag',
  });
  return contentTag;
};