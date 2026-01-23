import { DataTypes } from "sequelize";
import sequelize from "../dbconfig";

const UsersTable = sequelize.define("UsersTable", {
  ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  userPassword: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  userRole: {
    type: DataTypes.ENUM("user", "shopuser", "shopowner", "admin"),
    defaultValue: "user",
  },
  userProfileImage: {
    type: DataTypes.STRING,
    // defaultValue: "https://www.example.com/default-profile.png",
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  lastLogInTime: {
    type: DataTypes.DATE,
    defaultValue: null,
  },
  userAbout : {
    type: DataTypes.TEXT,
    defaultValue: null,
  },
  userGender:{
    type:DataTypes.ENUM("male","female","other"),
  }
});

export default UsersTable;