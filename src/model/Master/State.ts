import { DataTypes } from "sequelize";
import sequelize from "../dbconfig";

const State = sequelize.define("StateMaster", {
    ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    StateName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
});

export default State;