import { createChatRoom, getChatMessages, getChatRooms, getCountOfFileType, getFilesAndImages, getUserDetails } from "../Controller/Chat";

const express = require("express");
const route = express.Router();

route.post("/getUserDetails", getUserDetails);
route.post("/createChatRoom", createChatRoom);
route.post("/getChatRooms" , getChatRooms);
route.post("/getChatMessages" , getChatMessages);
route.post("/getCountOfFileType", getCountOfFileType);
route.post("/getFilesAndImages", getFilesAndImages);

export default route;