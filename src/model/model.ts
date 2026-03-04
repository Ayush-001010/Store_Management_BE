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
import PurchasingTrackingDayWiseTable from "./ShopRelatedTables/PurchasingTrackingDayWiseTable";
import ChatRoomTable from "./Chat/ChatRoomTable";
import ChatParticipantsTable from "./Chat/ChatParticipantsTable";
import MessageTable from "./Chat/MessageTable";
import CreateLayoutChat from "./ECOM/CreateLayoutChat";

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
  PurchasingTrackingDayWiseTable: typeof PurchasingTrackingDayWiseTable;
  ChatRoomTable: typeof ChatRoomTable;
  ChatParticipantsTable: typeof ChatParticipantsTable;
  MessageTable: typeof MessageTable;
  CreateLayoutChat : typeof CreateLayoutChat;
}

const model: ModelInterface = {
  UsersTable,
  City,
  State,
  Street,
  ShopCategory,
  Organization,
  Store,
  Inventory,
  Selling,
  PurchasingTrackingTable,
  PurchasingTrackingDayWiseTable,
  ChatRoomTable,
  ChatParticipantsTable,
  MessageTable,
  CreateLayoutChat
};

// Existing associations
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

PurchasingTrackingDayWiseTable.belongsTo(Store, { foreignKey: "storeId" });
Store.hasMany(PurchasingTrackingDayWiseTable, { foreignKey: "storeId" });

ChatRoomTable.belongsTo(Organization, { foreignKey: "organizationId" });
Organization.hasMany(ChatRoomTable, { foreignKey: "organizationId" });

MessageTable.belongsTo(ChatRoomTable, { foreignKey: "chatRoomID" });
ChatRoomTable.hasMany(MessageTable, { foreignKey: "chatRoomID" });

// ✅ NEW: Chat associations
ChatParticipantsTable.belongsTo(ChatRoomTable, { 
    foreignKey: "chatRoomID", 
    targetKey: "ID",
    as: "chatRoomDetails" 
});

ChatRoomTable.hasMany(ChatParticipantsTable, { 
    foreignKey: "chatRoomID", 
    sourceKey: "ID",
    as: "participants" 
});

export default model;