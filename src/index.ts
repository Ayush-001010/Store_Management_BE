import express from "express";
import sequelize from "./model/dbconfig";
import MasterRoutes  from "./Routes/MasterRoute";
import UserRoutes from "./Routes/UserRoutes";
import StoreManagementRoute from "./Routes/StoreManagementRoute";
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors({ origin : "*"}))

app.use("/master", MasterRoutes);
app.use("/user",UserRoutes);
app.use("/storeManagement",StoreManagementRoute);

app.listen(PORT, () => {
  sequelize.sync().then(() => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
