const { Model, DataTypes } = require("sequelize");
const sequelize = require("./dbconfig");

class Book extends Model { }

Book.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
    },
    author: {
      type: DataTypes.STRING,
    },
    review: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  },
  {
    sequelize,
    modelName: "book",
    timestamps: false,
  }
);

module.exports = Book;
