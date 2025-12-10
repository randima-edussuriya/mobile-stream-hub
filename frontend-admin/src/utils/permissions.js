export const permissions = {
  admin: ["category:add", "category:delete"],
  "inventory manager": ["category:add", "category:delete"],
  cashier: [],
  technician: [],
  "deliver person": [],
};

export const hasPermission = (role, action) =>
  permissions[role]?.includes(action);
