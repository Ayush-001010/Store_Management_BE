import { Sequelize } from "sequelize";

const sequelize = new Sequelize('store_management_store','root','Ayush@10',{
    host:"localhost",
    dialect:"mysql",
    logging:false
})



export default sequelize;