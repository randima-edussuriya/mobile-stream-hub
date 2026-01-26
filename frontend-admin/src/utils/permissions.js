export const permissions = {
  admin: [
    "category:add",
    "category:delete",
    "category:edit",
    "item:delete",
    "item:add",
    "item:edit",
    "order:cancel",
    "repair:danger-zone",
    "dayoff:edit",
    "dayoff:add",
    "leave:edit-status",
  ],
  "inventory manager": [
    "category:add",
    "category:delete",
    "category:edit",
    "item:delete",
    "item:add",
    "item:edit",
    "leave:add",
    "leave:edit",
  ],
  cashier: ["order:cancel", "leave:add", "leave:edit"],
  technician: ["leave:add", "leave:edit"],
  "deliver person": ["leave:add", "leave:edit"],
};

export const hasPermission = (role, action) =>
  permissions[role]?.includes(action);
