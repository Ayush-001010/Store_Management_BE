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
    validate: {
      notEmpty: true, // Ensure the name is not empty
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true, // Optional
  },
  establishDate: {
    type: DataTypes.DATEONLY, // Only the date component (no time)
    allowNull: true, // Optional
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true, // Optional for better location handling
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true, // Optional
  },
  postalCode: {
    type: DataTypes.STRING(10),
    allowNull: true, // Optional
  },
  isActive: {
    type: DataTypes.BOOLEAN, // Status flag to check if the organization is active
    defaultValue: true,
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