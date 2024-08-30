const db = require("..");

module.exports = (sequelize, DataTypes) =>
    sequelize.define("post", {
      post_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5
        }
      },
      username: {
        type: DataTypes.STRING(32),
        allowNull: false,
        references: {
          model: db.user,
          key: 'username'
        }
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: db.product,
          key: 'product_id'
        }
      }
    }, {
      // Don't add the timestamp attributes (updatedAt, createdAt).
      timestamps: false
    });
  