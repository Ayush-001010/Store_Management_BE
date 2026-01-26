import getImages from "../AWSOperation/GetImages";
import { Request, Response } from "express";

export const getUserImage = async (req: Request, res: Response) => {
  try {
    const key = req.body.key;
    console.log("Received key:", key);
    const response = await getImages(key);
    return res.send(response);
  } catch (error) {
    console.log("Error in getUserImage:", error);
    return res.send({ success: false, data: error });
  }
};
