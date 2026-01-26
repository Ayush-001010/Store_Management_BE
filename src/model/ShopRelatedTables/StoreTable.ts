import { DataTypes } from "sequelize";
import sequelize from "../dbconfig";

const Store = sequelize.define("StoreTable", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true, // Optional field
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  street: {
    type: DataTypes.STRING,
    allowNull: true, // Optional field
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true, // Optional field
  },
  postalCode: {
    type: DataTypes.STRING(10), // Length (e.g., ZIP codes)
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false, // Must have a category
  },
  is24hrOpen: {
    type: DataTypes.BOOLEAN, // True if shop is open 24 hours
    defaultValue: false,
  },
  openingTime: {
    type: DataTypes.TIME, // Stores time only
    allowNull: true, // Optional
  },
  closingTime: {
    type: DataTypes.TIME, // Stores time only
    allowNull: true, // Optional
  },
  firstSaleDate: {
    type: DataTypes.DATEONLY, // Stores date only
    allowNull: true, // Optional based on requirement
    comment: "The date when the shop started selling products",
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

export default Store;