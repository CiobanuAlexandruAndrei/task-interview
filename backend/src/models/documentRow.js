const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DocumentRow extends Model {
    static associate(models) {
      DocumentRow.belongsTo(models.Document, {
        foreignKey: 'documentId',
        as: 'document'
      });
    }
  }

  DocumentRow.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    documentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'documents',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'DocumentRow',
    tableName: 'document_rows',
    timestamps: false
  });

  return DocumentRow;
}; 