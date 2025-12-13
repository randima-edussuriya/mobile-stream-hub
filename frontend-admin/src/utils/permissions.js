export const permissions = {
  admin: [
    "category:add",
    "category:delete",
    "category:edit",
    "item:delete",
    "item:add",
  ],
  "inventory manager": [
    "category:add",
    "category:delete",
    "category:edit",
    "item:delete",
    "item:add",
  ],
  cashier: [],
  technician: [],
  "deliver person": [],
};

export const hasPermission = (role, action) =>
  permissions[role]?.includes(action);
