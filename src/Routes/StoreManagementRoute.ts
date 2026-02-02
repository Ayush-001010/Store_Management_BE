import { getAnalyticsData, getCardsValue, getOptions, getStoreData, setIsFavorite } from "../Controller/StoreManagement";

const express = require("express");
const route = express.Router();

route.post("/getCardValues" , getCardsValue);
route.post("/getAnalytics" , getAnalyticsData);
route.post("/getOptions" , getOptions);
route.post("/getStoreData",getStoreData);
route.post("/setFavoriteStore",setIsFavorite);


export default route;