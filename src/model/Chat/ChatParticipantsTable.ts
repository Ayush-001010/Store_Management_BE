import { DataTypes } from "sequelize";
import sequelize from "../dbconfig";

const ChatParticipantsTable = sequelize.define("ChatParticipantsTable", {
    ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    chatRoomID: {  // ✅ ADD THIS FIELD!
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'ChatRoomTables',  // Table name (Sequelize adds 's')
            key: 'ID'
        }
    },
    userID: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    joinedAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    lastSeenMessageID: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    isPinned: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    customNickname: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
}, {
    indexes: [
        {
            fields: ['chatRoomID'],
        },
    ],
});

export default ChatParticipantsTable;