import { DataTypes } from "sequelize";
import sequelize from "../dbconfig";

const MessageTable = sequelize.define("MessageTable", {
    ID :{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    senderName : {
        type: DataTypes.STRING,
        allowNull: false,
    },
    messageText : {
        type: DataTypes.STRING,
        allowNull: true,
    },
    messageType : {
        type: DataTypes.ENUM("text" , "image" , "file"),
        allowNull: false,
    },
    fileURL : {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isEdited : {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isDeleted : {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    fileType:{
        type: DataTypes.ENUM("Image" , "Other"),
        allowNull: true,
    }
});

export default MessageTable;