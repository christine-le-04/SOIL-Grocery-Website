module.exports = (sequelize, DataTypes) =>
    sequelize.define("product", {
      product_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      product_name: {
        type: DataTypes.STRING(40),
        allowNull: false
      },
      description: {
        type: DataTypes.STRING(500),
        allowNull: false
      },
      price: {
        type: DataTypes.DECIMAL(4,2),
        allowNull: false
      },
      image_url: {
        type: DataTypes.STRING(400),
        allowNull: false
      },
      is_special: {
        type: DataTypes.STRING(10),
        allowNull: false
      }
    }, {
      // Don't add the timestamp attributes (updatedAt, createdAt).
      timestamps: false
    });
  