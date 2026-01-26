import { DataTypes } from "sequelize";
import sequelize from "../dbconfig";

const PurchasingTrackingTable = sequelize.define("PurchasingTrackingTable", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  month: {
    type: DataTypes.STRING,
    allowNull: false, // Ensures a valid month is provided
    validate: {
      isIn: {
        args: [
          [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ],
        ], // Validates that the month is in the list of months
        msg: "Month must be a valid month name",
      },
    },
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: true, // Ensure the year is an integer
      isPositive: {
        args: true,
        msg: "Year must be a valid positive number",
      },
    },
  },
  revenue: {
    type: DataTypes.FLOAT, // Revenue as a floating-point value
    allowNull: false,
    defaultValue: 0.0,
  },
  loss: {
    type: DataTypes.FLOAT, // Loss as a floating-point value
    allowNull: false,
    defaultValue: 0.0,
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

export default PurchasingTrackingTable;