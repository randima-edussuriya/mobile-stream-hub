export const permissions = {
  admin: [
    "category:add",
    "category:delete",
    "category:edit",
    "item:delete",
    "item:add",
    "item:edit",
    "order:cancel",
  ],
  "inventory manager": [
    "category:add",
    "category:delete",
    "category:edit",
    "item:delete",
    "item:add",
    "item:edit",
  ],
  cashier: ["order:cancel"],
  technician: [],
  "deliver person": [],
};

export const hasPermission = (role, action) =>
  permissions[role]?.includes(action);
