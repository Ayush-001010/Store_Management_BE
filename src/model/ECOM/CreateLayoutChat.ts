import { DataTypes } from "sequelize";
import sequelize from "../dbconfig";

const CreateLayoutChat = sequelize.define("CreateLayoutChatTable", {
    ID : {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userID : {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    type : {
        type: DataTypes.ENUM("AI" , "User"),
        allowNull: false,
    },
    message : {
        type: DataTypes.TEXT,
        allowNull: false,
    },
});

export default CreateLayoutChat;