import City from "./Master/City";
import ShopCategory from "./Master/ShopCategory";
import State from "./Master/State";
import Street from "./Master/Street";
import UsersTable from "./User/UsersTable";

const model: Record<string, any> = {
  UsersTable,
  City,
  State,
  Street,
  ShopCategory,
};

State.hasMany(City);
City.belongsTo(State);

City.hasMany(Street);
Street.belongsTo(City);

export default model;
