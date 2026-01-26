import { Request, Response } from "express";
import model from "../model/model";
import { Op, Sequelize } from "sequelize";

export const getCardsValue = async (req: Request, res: Response) => {
  try {
    const { type, organizationId } = req.body;
    switch (type) {
      case "totalshops": {
        const response = await model.Store.count({
          where: { organizationId },
        });
        return res.send({ success: true, data: response });
      }
      case "numberOfProfitMakingShops": {
        const storeIDs = (
          await model.Store.findAll({
            where: { organizationId },
            attributes: ["id"],
          })
        ).map((store: any) => store.id);

        const numberOfProfitMakingShops =
          await model.PurchasingTrackingTable.count({
            where: {
              [Op.and]: [
                {
                  storeId: {
                    [Op.between]: [...storeIDs], // Include only specified store IDs within the range
                  },
                },
                Sequelize.literal(`revenue - loss > 0`), // Use Sequelize.literal directly
              ],
            },
          });
        return res.send({ success: true, data: numberOfProfitMakingShops });
      }
      case "totalrevenue": {
        const storeIDs = (
          await model.Store.findAll({
            where: { organizationId },
            attributes: ["id"],
          })
        ).map((store: any) => store.id);

        const totalRevenueResult = await model.PurchasingTrackingTable.findAll({
          where: {
            storeId: {
              [Op.between]: [...storeIDs],
            },
          },
          attributes: [
            [Sequelize.fn("SUM", Sequelize.col("revenue")), "totalRevenue"],
          ],
        });

        const totalRevenue =
          totalRevenueResult[0].getDataValue("totalRevenue") || 0;

        return res.send({ success: true, data: totalRevenue });
      }
      default: {
        return res.send({ success: false, data: "Invalid type" });
      }
    }
  } catch (error) {
    console.error("Error in getCardsValue:", error);
    return res.send({ success: false, data: "Something went wrong" });
  }
};
