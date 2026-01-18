import express from "express";
import sequelize from "./model/dbconfig";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

app.listen(PORT, () => {
  sequelize.sync({force:true}).then(() => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
