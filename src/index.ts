import express from "express";
import sequelize from "./model/dbconfig";
import MasterRoutes  from "./Routes/MasterRoute";
import UserRoutes from "./Routes/UserRoutes";
import StoreManagementRoute from "./Routes/StoreManagementRoute";
import ChatRoutes from "./Routes/ChatRoutes";
import cors from 'cors';
import { Server} from "socket.io";
import { createServer } from "http";
import Client from "./Client";
import model from "./model/model";
import CommonRoutes from "./Routes/CommonRoutes";

const app = express();
const PORT = process.env.PORT || 8000;

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

app.use(express.json());
app.use(cors({ origin: "*" }));

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("register" , (message) => {
    const {userId , userEmail} = message;
    console.log("User registered with ID:", userId, "and Email:", userEmail);
    const keyStr = `${userId}-${userEmail}`;
    Client.set(keyStr, socket.id);
  });

  socket.on("send-message" , async (data) => {
    const { chatRoomID , message , senderName , userID : IDVal , fileURL , fileType} = data;
    console.log("Message received in chat room:", chatRoomID, "Message:", message, "Sender:", senderName , "File URL:", fileURL , "File Type:", fileType);
    
    await model.MessageTable.create({
      senderName ,
      messageText : message,
      messageType : fileURL ? "file" : "text",
      fileURL,
      isEdited : false,
      isDeleted : false,
      chatRoomID,
      fileType
    });

    const userDetails = await model.ChatParticipantsTable.findAll({ where: { chatRoomID } });

    userDetails.forEach(async (user) => {
      const { userID } = user.dataValues;

      if(IDVal === data.ID) return;

      const userInfo = await model.UsersTable.findOne({ where: { ID: userID } });

      if(userInfo){
        const { ID , userEmail } = userInfo.dataValues;
        const keyStr = `${ID}-${userEmail}`;
        const socketId = await Client.get(keyStr);
        if(socketId) {
          console.log("Emitting message to socket ID:", socketId , "for user ID:", userEmail);
          io.to(socketId).emit("receive-message", { chatRoomID, message, senderName  });
        }
      }

    });

  });

  socket.on("typing-start" , async (data) => {
    const { chatRoomID , userName } = data;
    const userDetails = await model.ChatParticipantsTable.findAll({ where: { chatRoomID } });
    
    userDetails.forEach(async (user) => {
      const { userID } = user.dataValues;
      const userInfo = await model.UsersTable.findOne({ where: { ID: userID } });
      if(userInfo){
        const { ID , userEmail } = userInfo.dataValues;
        const keyStr = `${ID}-${userEmail}`;
        const socketId = await Client.get(keyStr);
        if(socketId) {
          console.log("Emitting typing-start to socket ID:", socketId , "for user ID:", userEmail);
          io.to(socketId).emit("user-typing", { chatRoomID, userName });
        }
    }});
  });

  socket.on("typing-stop" , async (data) => {
    const { chatRoomID , userName } = data;
    const userDetails = await model.ChatParticipantsTable.findAll({ where: { chatRoomID } });
    
    userDetails.forEach(async (user) => {
      const { userID } = user.dataValues;
      const userInfo = await model.UsersTable.findOne({ where: { ID: userID } });
      if(userInfo){
        const { ID , userEmail } = userInfo.dataValues;
        const keyStr = `${ID}-${userEmail}`;
        const socketId = await Client.get(keyStr);
        if(socketId) {
          console.log("Emitting typing-stop to socket ID:", socketId , "for user ID:", userEmail);
          io.to(socketId).emit("user-stopped-typing", { chatRoomID, userName });
        }
    }});
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

});

app.use("/master", MasterRoutes);
app.use("/user", UserRoutes);
app.use("/storeManagement", StoreManagementRoute);
app.use("/chat", ChatRoutes);
app.use("/common", CommonRoutes);

// Change this from app.listen to server.listen
server.listen(PORT, () => {
  sequelize.sync().then(() => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});

export {io} ;