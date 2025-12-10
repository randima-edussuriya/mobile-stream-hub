export const permissions = {
  admin: ["category:add", "category:delete", "category:edit"],
  "inventory manager": ["category:add", "category:delete", "category:edit"],
  cashier: [],
  technician: [],
  "deliver person": [],
};

export const hasPermission = (role, action) =>
  permissions[role]?.includes(action);
