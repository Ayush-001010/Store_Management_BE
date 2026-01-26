import City from "./Master/City";
import ShopCategory from "./Master/ShopCategory";
import State from "./Master/State";
import Street from "./Master/Street";
import UsersTable from "./User/UsersTable";
import Organization from "./ShopRelatedTables/OrganizationTable";
import Store from "./ShopRelatedTables/StoreTable";
import Selling from "./ShopRelatedTables/SellingTable";
import Inventory from "./ShopRelatedTables/InventoryTable";
import PurchasingTrackingTable from "./ShopRelatedTables/PurchasingTrackingTable";

export interface ModelInterface {
  UsersTable: typeof UsersTable;
  City: typeof City;
  State: typeof State;
  Street: typeof Street;
  ShopCategory: typeof ShopCategory;
  Organization: typeof Organization;
  Store: typeof Store;
  Inventory: typeof Inventory;
  Selling: typeof Selling;
  PurchasingTrackingTable: typeof PurchasingTrackingTable;
}

const model:ModelInterface = {
  UsersTable,
  City,
  State,
  Street,
  ShopCategory,
  Organization,
  Store,
  Inventory,
  Selling,
  PurchasingTrackingTable
};

State.hasMany(City);
City.belongsTo(State);

City.hasMany(Street);
Street.belongsTo(City);

UsersTable.belongsTo(Organization, { foreignKey: "organizationId" });
Organization.hasMany(UsersTable, { foreignKey: "organizationId" });

Organization.hasMany(Store, { foreignKey: "organizationId" });
Store.belongsTo(Organization, { foreignKey: "organizationId" });

Inventory.belongsTo(Store, { foreignKey: "storeId" });
Store.hasMany(Inventory, { foreignKey: "storeId" });

Selling.belongsTo(Store, { foreignKey: "storeId" });
Store.hasMany(Selling, { foreignKey: "storeId" });

Selling.belongsTo(Inventory, { foreignKey: "inventoryId" });
Inventory.hasMany(Selling, { foreignKey: "inventoryId" });

PurchasingTrackingTable.belongsTo(Store, { foreignKey: "storeId" });
Store.hasMany(PurchasingTrackingTable, { foreignKey: "storeId" });



export default model;
