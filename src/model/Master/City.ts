import { DataTypes } from "sequelize";
import sequelize from "../dbconfig";

const City = sequelize.define("CityMaster", {
  ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cityName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

export default City;
