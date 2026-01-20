import { DataTypes } from "sequelize";
import sequelize from "../dbconfig";

const Street = sequelize.define("StreetMaster", {
  ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  StreetName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});
export default Street;
