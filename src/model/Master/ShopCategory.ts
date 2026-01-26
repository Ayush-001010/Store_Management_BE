import { DataTypes } from "sequelize";
import sequelize from "../dbconfig";

const ShopCategory = sequelize.define("ShopCategoryMaster", {
  ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  categoryName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

export default ShopCategory;