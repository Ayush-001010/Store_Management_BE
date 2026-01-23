import { DataTypes } from "sequelize";
import sequelize from "../dbconfig";

const Organization = sequelize.define("OrganizationTable", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true, // Ensures a valid email format
    },
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true, // Phone number is optional
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  establishedBy: {
    type: DataTypes.STRING, // This stores the name or username, you can change it to INTEGER if it's a foreign key
    allowNull: false,
    comment: "Stores the name or username of the person who established the organization",
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

export default Organization;