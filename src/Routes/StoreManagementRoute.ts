import { getAnalyticsData, getCardsValue, getOptions } from "../Controller/StoreManagement";

const express = require("express");
const route = express.Router();

route.post("/getCardValues" , getCardsValue);
route.post("/getAnalytics" , getAnalyticsData);
route.post("/getOptions" , getOptions);


export default route;