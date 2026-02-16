import { DataTypes } from "sequelize";
import sequelize from "../dbconfig";

const ChatRoomTable = sequelize.define("ChatRoomTable", {
    ID :{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    roomName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    roomType:{
        type: DataTypes.ENUM("one-to-one" , "group"),
        allowNull: false,
    },
    createdBy:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastMessageTime:{
        type: DataTypes.DATE,
        allowNull: true,
    },
    lastMessageText : {
        type: DataTypes.STRING,
        allowNull: true,
    },
    chatRoomImage : {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

export default ChatRoomTable;