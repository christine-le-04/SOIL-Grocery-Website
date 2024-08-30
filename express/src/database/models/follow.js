const db = require("..");
module.exports = (sequelize, DataTypes) =>
  sequelize.define("follow", {
    following_username: {
      type: DataTypes.STRING(32),
      allowNull: false,
      references: {
        model: db.user,
        key: 'username'
      }
    },
    follower_username: {
      type: DataTypes.STRING(32),
      allowNull: false,
      references: {
        model: db.user,
        key: 'username'
      }
    }
  }, {
    // Don't add the timestamp attributes (updatedAt, createdAt).
    timestamps: false
  });
  