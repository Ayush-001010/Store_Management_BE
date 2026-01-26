import { DataTypes } from "sequelize";
import sequelize from "../dbconfig";

const Selling = sequelize.define("SellingTable", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  quantitySold: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1, // At least 1 unit sold
    },
  },
  unitSellingPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  totalPrice: {
    type: DataTypes.VIRTUAL, // Derived field
    get() {
      const quantity = this.getDataValue("quantitySold");
      const price = this.getDataValue("unitSellingPrice");
      return (quantity && price) ? (quantity * price).toFixed(2) : null;
    },
  },
  dateOfSale: {
    type: DataTypes.DATEONLY, // Keeps track of the sale date
    allowNull: false,
    defaultValue: DataTypes.NOW, // Defaults to the current date
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

export default Selling;