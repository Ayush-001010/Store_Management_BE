import { getLocationDetails } from "../Controller/Master";

const express = require("express");
const route = express.Router();

route.post("/masterDetails", getLocationDetails);

export default route;
