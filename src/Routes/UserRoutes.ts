import { getUserImage } from "../Controller/UserDetails";

const express = require("express");
const route = express.Router();

route.post("/userImage", getUserImage);

export default route;