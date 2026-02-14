import uploadFile from "../AWSOperation/UploadFile";
import { Request, Response } from "express";

const express = require("express");
const route = express.Router();

route.post("/uploadFile" , async (req : Request, res : Response) => {
    const { fileName , fileType} = req.body;
    if(!fileName) {
        return res.send({ success: false, data: "File name is required" });
    } else {
        const response = await uploadFile(fileName , fileType);
        return res.send(response);
    }
});

export default route;