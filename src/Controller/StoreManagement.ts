import { Request, Response } from "express";
import model from "../model/model";
import { Op, Sequelize } from "sequelize";
import CommonConfig from "../Config/CommonConfig";

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

        const profitMakingShops = await model.PurchasingTrackingTable.findAll({
          attributes: [
            "storeId",
            [Sequelize.fn("SUM", Sequelize.col("revenue")), "totalRevenue"],
            [Sequelize.fn("SUM", Sequelize.col("loss")), "totalLoss"],
          ],
          where: {
            storeId: {
              [Op.between]: [...storeIDs],
            },
          },
          group: ["storeId"],
          having: Sequelize.literal("SUM(revenue) - SUM(loss) > 0"),
        });

        const numberOfProfitMakingShops = profitMakingShops.length;

        return res.send({ success: true, data: numberOfProfitMakingShops });
      }
      case "totalrevenue": {
        const storeIDs = (
          await model.Store.findAll({
            where: { organizationId },
            attributes: ["id"],
          })
        ).map((store: any) => store.id);

        const monthStr = CommonConfig.months[new Date().getMonth()];
        const year = new Date().getFullYear();

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

export const getAnalyticsData = async (req: Request, res: Response) => {
  try {
    const { type, durationType, organizationId, analyticType } = req.body;
    console.log(
      "Received analyticType:",
      analyticType,
      "type:",
      type,
      "durationType:",
      durationType
    );
    switch (type) {
      case "acrossAllShop": {
        let currentYear = new Date().getFullYear();
        let monthIndex = new Date().getMonth();

        const storeIDs = (
          await model.Store.findAll({
            where: { organizationId },
            attributes: ["id"],
          })
        ).map((store: any) => store.id);
        const results = [];
        const columnName: any =
          analyticType === "revenue"
            ? "revenue"
            : analyticType === "loss"
            ? "loss"
            : Sequelize.literal("revenue - loss"); // Handle raw calculations

        switch (durationType) {
          case "yearly": {
            for (let i = 0; i < 12; i++) {
              const monthStr = CommonConfig.months[monthIndex];

              const response =
                analyticType === "revenue" || analyticType === "loss"
                  ? await model.PurchasingTrackingTable.sum(columnName, {
                      where: {
                        month: monthStr,
                        year: currentYear,
                        storeId: {
                          [Op.between]: [...storeIDs],
                        },
                      },
                    })
                  : (
                      await model.PurchasingTrackingTable.findAll({
                        attributes: [
                          [Sequelize.literal("SUM(revenue - loss)"), "value"], // Raw SQL calculation
                        ],
                        where: {
                          month: monthStr,
                          year: currentYear,
                          storeId: {
                            [Op.between]: [...storeIDs],
                          },
                        },
                      })
                    )[0]?.get("value"); // Extract the calculated sum from the result

              const obj = {
                month: monthStr,
                year: currentYear,
                value: response || 0,
              };
              monthIndex--;
              if (monthIndex < 0) {
                monthIndex = 11;
                currentYear--;
              }
              results.push(obj);
            }
            break;
          }
          case "monthly": {
            let currentMonth = CommonConfig.months[new Date().getMonth()];
            let currentYear = new Date().getFullYear();

            for (let i = 0; i < 31; i++) {
              const dateStr = (i + 1).toString(); // Dates are 1-indexed

              const response =
                analyticType === "revenue" || analyticType === "loss"
                  ? await model.PurchasingTrackingDayWiseTable.sum(columnName, {
                      where: {
                        day: dateStr,
                        month: currentMonth,
                        year: currentYear,
                        storeId: {
                          [Op.between]: [...storeIDs],
                        },
                      },
                    })
                  : (
                      await model.PurchasingTrackingDayWiseTable.findAll({
                        attributes: [
                          [Sequelize.literal("SUM(revenue - loss)"), "value"], // Raw SQL calculation
                        ],
                        where: {
                          day: dateStr,
                          month: currentMonth,
                          year: currentYear,
                          storeId: {
                            [Op.between]: [...storeIDs],
                          },
                        },
                      })
                    )[0]?.get("value"); // Extract the calculated sum from the result

              const obj = {
                day: dateStr,
                month: currentMonth,
                year: currentYear,
                value: response || 0,
              };
              results.push(obj);
            }
            break;
          }
          case "weekly": {
            for (let i = 6; i >= 0; i--) {
              const dateObj = new Date();
              dateObj.setDate(dateObj.getDate() - i);

              const dateStr = dateObj.getDate().toString();
              const monthStr = CommonConfig.months[dateObj.getMonth()];
              const year = dateObj.getFullYear();

              const response =
                analyticType === "revenue" || analyticType === "loss"
                  ? await model.PurchasingTrackingDayWiseTable.sum(columnName, {
                      where: {
                        date: dateStr,
                        month: monthStr,
                        year: year,
                        storeId: {
                          [Op.between]: [...storeIDs],
                        },
                      },
                    })
                  : (
                      await model.PurchasingTrackingDayWiseTable.findAll({
                        attributes: [
                          [Sequelize.literal("SUM(revenue - loss)"), "value"], // Raw SQL calculation
                        ],
                        where: {
                          date: dateStr,
                          month: monthStr,
                          year: year,
                          storeId: {
                            [Op.between]: [...storeIDs],
                          },
                        },
                      })
                    )[0]?.get("value"); // Extract the calculated sum from the result

              const obj = {
                date: dateStr,
                month: monthStr,
                year: year,
                value: response || 0,
              };
              results.push(obj);
            }
            break;
          }
        }

        return res.send({ success: true, data: results });
      }
      case "specificShop": {
        console.log("Processing specificShop with analyticType:", analyticType);
        const { storeId } = req.body;
        let currentYear = new Date().getFullYear();
        let monthIndex = new Date().getMonth();
        const columnName: any =
          analyticType === "revenue"
            ? "revenue"
            : analyticType === "loss"
            ? "loss"
            : Sequelize.literal("revenue - loss"); // Handle raw calculations

        const results = [];
        switch (durationType) {
          case "yearly": {
            for (let i = 0; i < 12; i++) {
              const monthStr = CommonConfig.months[monthIndex];
              const response =
                analyticType === "revenue" || analyticType === "loss"
                  ? await model.PurchasingTrackingTable.sum(columnName, {
                      where: {
                        month: monthStr,
                        year: currentYear,
                        storeId,
                      },
                    })
                  : (
                      await model.PurchasingTrackingTable.findAll({
                        attributes: [
                          [Sequelize.literal("SUM(revenue - loss)"), "value"], // Raw SQL calculation
                        ],
                        where: {
                          month: monthStr,
                          year: currentYear,
                          storeId,
                        },
                      })
                    )[0]?.get("value"); // Extract the calculated sum from the result

              const obj = {
                month: monthStr,
                year: currentYear,
                value: response || 0,
              };
              monthIndex--;
              if (monthIndex < 0) {
                monthIndex = 11;
                currentYear--;
              }
              results.push(obj);
            }
            break;
          }
          case "monthly": {
            let currentMonth = CommonConfig.months[new Date().getMonth()];
            let currentYear = new Date().getFullYear();
            for (let i = 0; i < 31; i++) {
              const dateStr = (i + 1).toString(); // Dates are 1-indexed

              const response =
                analyticType === "revenue" || analyticType === "loss"
                  ? await model.PurchasingTrackingDayWiseTable.sum(columnName, {
                      where: {
                        day: dateStr,
                        month: currentMonth,
                        year: currentYear,
                        storeId,
                      },
                    })
                  : (
                      await model.PurchasingTrackingDayWiseTable.findAll({
                        attributes: [
                          [
                            Sequelize.literal(
                              "SUM(COALESCE(revenue, 0) - COALESCE(loss, 0))"
                            ),
                            "value",
                          ],
                        ],
                        where: {
                          day: dateStr,
                          month: currentMonth,
                          year: currentYear,
                          storeId,
                        },
                      })
                    )?.[0]?.get("value") || 0;

              console.log(
                `Date: ${dateStr}, Month: ${currentMonth}, Year: ${currentYear}, Response: ${response}`
              );
              const obj = {
                day: dateStr,
                month: currentMonth,
                year: currentYear,
                value: response || 0,
              };
              results.push(obj);
            }
            console.log("Monthly Results:", results);
            break;
          }
          case "weekly": {
            for (let i = 6; i >= 0; i--) {
              const dateObj = new Date();
              dateObj.setDate(dateObj.getDate() - i);

              const dateStr = dateObj.getDate().toString();
              const monthStr = CommonConfig.months[dateObj.getMonth()];
              const year = dateObj.getFullYear();

              const response =
                analyticType === "revenue" || analyticType === "loss"
                  ? await model.PurchasingTrackingDayWiseTable.sum(columnName, {
                      where: {
                        day: dateStr,
                        month: monthStr,
                        year: year,
                        storeId,
                      },
                    })
                  : (
                      await model.PurchasingTrackingDayWiseTable.findAll({
                        attributes: [
                          [Sequelize.literal("SUM(revenue - loss)"), "value"], // Raw SQL calculation
                        ],
                        where: {
                          date: dateStr,
                          month: monthStr,
                          year: year,
                          storeId,
                        },
                      })
                    )[0]?.get("value"); // Extract the calculated sum from the result

              const obj = {
                date: dateStr,
                month: monthStr,
                year: year,
                value: response || 0,
              };
              results.push(obj);
            }
            break;
          }
        }
        return res.send({ success: true, data: results });
      }
    }
    return res.send({ success: false, data: "Invalid type" });
  } catch (error) {
    console.error("Error in getAnalyticsData:", error);
    return res.send({ success: false, data: "Something went wrong" });
  }
};

export const getOptions = async (req: Request, res: Response) => {
  try {
    const { organizationId, type } = req.body;

    switch (type) {
      case "storeList": {
        const storeList = await model.Store.findAll({
          where: { organizationId },
          attributes: ["id", "name"],
        });
        return res.send({ success: true, data: storeList });
      }
    }
    return res.send({ success: false, data: "Invalid type" });
  } catch (error) {
    console.error("Error in getOptions:", error);
    return res.send({ success: false, data: "Something went wrong" });
  }
};

export const getStoreData = async (req: Request, res: Response) => {
  try {
    const { type , organizationId } = req.body;
    console.log("getStoreData called with type:", type, "organizationId:", organizationId);
    switch (type) {
      case "All_Store":{
        const storeData = await model.Store.findAll({
          where: { organizationId  , isActive: true },
        });
        return res.send({ success: true, data: storeData });
      }
      case "Favorite_Store":{
        const favoriteStores = await model.Store.findAll({
          where: { organizationId , isFavorite: true , isActive: true },
        });
        return res.send({ success: true, data: favoriteStores });
      }
      case "Profit" :{
        const profitableStores = await model.Store.findAll({
          where: {
            organizationId,
            isActive: true,
            profit: {
              [Op.gte]: Sequelize.col('loss'),
            }
          },
        });
        return res.send({ success: true, data: profitableStores });
      }
      case "Loss" :{
        const lossMakingStores = await model.Store.findAll({
          where: {
            organizationId,
            isActive: true,
            loss: {
              [Op.gte]: Sequelize.col('profit'),
            }
          },
        });
        return res.send({ success: true, data: lossMakingStores });
      }
      case "Most_Sold_Items" :{
        const storesBySoldItems = await model.Store.findAll({
          where: { organizationId , isActive: true },
          order: [['soldItemsCount', 'DESC']],
        });
        return res.send({ success: true, data: storesBySoldItems });
      }
    }
    return res.send({ success: false, data: "Invalid type" });
  } catch (error) {
    console.error("Error in getStoreData:", error);
    return res.send({ success: false, data: "Something went wrong" });
  }
};

export const setIsFavorite = async (req: Request, res: Response) => {
  try {
    const { id, isFavorite } = req.body;
    
    await model.Store.update(
      { isFavorite },
      { where: { id } }
    );

    return res.send({ success: true, data: "Favorite status updated successfully" });
  } catch (error) {
    console.error("Error in setIsFavorite:", error);
    return res.send({ success: false, data: "Something went wrong" });
  }
}