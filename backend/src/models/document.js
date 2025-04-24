const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Document extends Model {
    static associate(models) {
      Document.hasMany(models.DocumentRow, {
        foreignKey: 'documentId',
        as: 'rows'
      });
    }
  }

  Document.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }, {
    sequelize,
    modelName: 'Document',
    tableName: 'documents',
    timestamps: false
  });

  return Document;
}; 