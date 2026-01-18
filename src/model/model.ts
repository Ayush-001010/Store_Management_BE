import { Model, ModelCtor } from "sequelize";
import UsersTable from "./User/UsersTable";

const model : Record<string,ModelCtor<Model<any, any>>> = {
    UsersTable : UsersTable
};

export default model;