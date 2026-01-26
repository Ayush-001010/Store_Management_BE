import { Request, Response } from "express";
import model from "../model/model";

export const getLocationDetails = async (req: Request, res: Response) => {
  try {
    const { type } = req.body;
    switch (type) {
      case "state": {
        const response = await model.State.findAll();
        return res.send({
          success: true,
          data: response.map((item: any) => {
            return { id: item.ID, name: item.StateName };
          }),
        });
      }
      case "category": {
        const response = await model.ShopCategory.findAll();
        return res.send({
          success: true,
          data: response.map((item: any) => {
            return { id: item.ID, name: item.categoryName };
          }),
        });
      }
      case "city": {
        const { stateID } = req.body;
        const response = await model.City.findAll({
          where: { StateMasterID: stateID },
        });
        return res.send({
          success: true,
          data: response.map((item: any) => {
            return { id: item.ID, name: item.cityName };
          }),
        });
      }
      case "street": {
        const { cityID } = req.body;
        const response = await model.Street.findAll({
          where: { CityMasterID: cityID },
        });
        return res.send({
          success: true,
          data: response.map((item: any) => {
            return { id: item.ID, name: item.StreetName };
          }),
        });
      }
      default:
        return res.send({ success: false, data: "Type does not match" });
    }
  } catch (error) {
    console.log("Error ", error);
    return res.send({
      success: false,
      data: "Something went wrong",
    });
  }
};
