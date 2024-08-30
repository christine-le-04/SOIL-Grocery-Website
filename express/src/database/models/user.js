module.exports = (sequelize, DataTypes) =>
    sequelize.define("user", {
      email: {
        type: DataTypes.STRING(254),
        primaryKey: true
      },
      username: {
        type: DataTypes.STRING(32),
        allowNull: false,
        unique: true
        // index: true  
      },
      password_hash: {
        type: DataTypes.STRING(200),
        allowNull: false
      },
      first_name: {
        type: DataTypes.STRING(40),
        allowNull: false
      },
      last_name: {
        type: DataTypes.STRING(40),
        allowNull: false
      },
      date_created: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      blocked: {
        type: DataTypes.STRING(10),
        allowNull: false
      }
    }, {
      // Don't add the timestamp attributes (updatedAt, createdAt).
      timestamps: false
    });
  