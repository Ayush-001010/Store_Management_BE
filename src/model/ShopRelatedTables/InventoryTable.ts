import { DataTypes } from "sequelize";
import sequelize from "../dbconfig";

const Inventory = sequelize.define("InventoryTable", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  subCategory: {
    type: DataTypes.STRING,
    allowNull: false,
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  company: {
    type: DataTypes.STRING,
    allowNull: true, // Optional field
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true, // Optional
  },
  costPrice: {
    type: DataTypes.FLOAT, // Floating point number
    allowNull: false,
  },
  sellingPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  crossPrice: {
    type: DataTypes.FLOAT, // Optional field (for comparison purposes)
    allowNull: true,
  },
  profitAmount: {
    type: DataTypes.INTEGER, // Derived field
    get() {
      const selling = this.getDataValue("sellingPrice");
      const cost = this.getDataValue("costPrice");
      return (selling && cost) ? (selling - cost).toFixed(2) : null; // Auto-calculate profit
    },
  },
  isInStock: {
    type: DataTypes.BOOLEAN,
    defaultValue: true, // Defaults to true
  },
  lowAlertLimit: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10, // Minimum units before triggering low stock alert
  },
  manufactureDate: {
    type: DataTypes.DATEONLY, // Stores only dates
    allowNull: true,
  },
  expiryDate: {
    type: DataTypes.DATEONLY,
    allowNull: true, // Optional field
  },
  placementDetails: {
    type: DataTypes.TEXT,
    allowNull: true, // Optional description of product placement
  },
  isDiscounted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Defaults to false
  },
  discountPercentage: {
    type: DataTypes.FLOAT,
    allowNull: true,
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

export default Inventory;