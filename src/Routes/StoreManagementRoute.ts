import { getCardsValue } from "../Controller/StoreManagement";

const express = require("express");
const route = express.Router();

route.post("/getCardValues" , getCardsValue);


export default route;