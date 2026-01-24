import e from "express";

export const validateRegister = (req, res, next) => {
  const firstName = String(req.body.firstName || "").trim();
  const lastName = String(req.body.lastName || "").trim();
  const password = String(req.body.password || "").trim();
  const email = String(req.body.email || "")
    .trim()
    .toLocaleLowerCase();
  const phoneNo = String(req.body.phoneNo || "").trim();
  const nicNo = String(req.body.nicNo || "").trim();
  const address = String(req.body.address || "").trim();
  const staffTypeId = String(req.body.staffTypeId || "").trim();
  const purpose = String(req.body.purpose || "").trim();

  // validate empty fields
  if (
    !firstName ||
    !lastName ||
    !password ||
    !email ||
    !phoneNo ||
    !nicNo ||
    !address ||
    !staffTypeId ||
    !purpose
  ) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  // validate password strength
  if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password,
    )
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Password must include at least one lowercase letter, one uppercase letter, one digit, one special character and be at least 8 characters long",
    });
  }

  // validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email format" });
  }

  // validate phone number format
  if (!/^(?:\+94|0)[1-9][0-9]{8}$/.test(phoneNo)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid phone number format" });
  }

  // validate NIC format
  if (!/^[0-9]{9}[vV]$|^[0-9]{12}$/.test(nicNo)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid NIC number format" });
  }

  req.body = {
    firstName,
    lastName,
    password,
    email,
    phoneNo,
    nicNo,
    address,
    staffTypeId,
    purpose,
  };
  next();
};

export const validateUpdateUserStatus = (req, res, next) => {
  const staffId = req.params.staffId?.trim();
  const { isActive } = req.body;
  const { userId } = req.user;

  // validate staffId
  if (!staffId || isNaN(staffId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid staff ID" });
  }

  // validate isActive (must be boolean)
  if (typeof isActive !== "boolean") {
    return res.status(400).json({
      success: false,
      message: "Invalid status value. Expecting true or false.",
    });
  }

  // prevent deativating own account
  if (userId == staffId)
    return res.status(403).json({
      success: false,
      message: "You cannot change the status of your own account.",
    });

  req.body.staffId = staffId;
  next();
};

export const validateUpdateCustomerStatus = (req, res, next) => {
  const customerId = req.params.customerId?.trim();
  const { isActive } = req.body;

  // validate customerId
  if (!customerId || isNaN(customerId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid customer ID" });
  }

  // validate isActive (must be boolean)
  if (typeof isActive !== "boolean") {
    return res.status(400).json({
      success: false,
      message: "Invalid status value. Expecting true or false.",
    });
  }

  req.body.customerId = customerId;
  next();
};

// validate staff user ID
export const validateStaffUserId = (req, res, next) => {
  const staffId = req.params.staffId?.trim();

  if (!staffId || isNaN(staffId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid staff ID" });
  }
  req.body = { ...req.body, staffId };
  next();
};

export const validateUpdateStaffUser = (req, res, next) => {
  const staffId = req.params.staffId?.trim();
  const firstName = req.body.firstName?.trim();
  const lastName = req.body.lastName?.trim();
  const phoneNo = req.body.phoneNo?.trim();
  const nicNo = req.body.nicNo?.trim();
  const address = req.body.address?.trim();
  const staffTypeId = req.body.staffTypeId;

  // validate ID
  if (!staffId || isNaN(staffId) || !staffTypeId || isNaN(staffTypeId)) {
    return res.status(400).json({ success: false, message: "Invalid ID" });
  }

  if (!firstName || !lastName || !phoneNo || !nicNo || !address) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  // validate phone number format
  if (!/^(?:\+94|0)[1-9][0-9]{8}$/.test(phoneNo)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid phone number format" });
  }

  // validate NIC format
  if (!/^[0-9]{9}[vV]$|^[0-9]{12}$/.test(nicNo)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid NIC number format" });
  }
  req.body = {
    staffId,
    firstName,
    lastName,
    phoneNo,
    nicNo,
    address,
    staffTypeId,
  };
  next();
};

export const validateCategoryId = (req, res, next) => {
  const categoryId = req.params.categoryId?.trim();

  if (!categoryId || isNaN(categoryId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid category ID" });
  }
  req.body = { ...req.body, categoryId };
  next();
};

export const validateUpdateCategory = (req, res, next) => {
  const categoryId = req.params.categoryId?.trim();
  const categoryName = req.body.categoryName?.trim();
  const categoryType = req.body.categoryType?.trim();

  // validate category ID
  if (!categoryId || isNaN(categoryId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Category ID" });
  }

  // validate category name and type
  if (!categoryName || !categoryType) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  // validate category type
  const validTypes = ["phone", "accessory", "repair part"];
  if (!validTypes.includes(categoryType.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: "Invalid category type.",
    });
  }
  req.body = { categoryId, categoryName, categoryType };
  next();
};

export const validateAddCategory = (req, res, next) => {
  const categoryName = req.body.categoryName?.trim();
  const categoryType = req.body.categoryType?.trim();

  // validate empty fields
  if (!categoryName || !categoryType) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  // validate category type
  const validTypes = ["phone", "accessory", "repair part"];
  if (!validTypes.includes(categoryType.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: "Invalid category type.",
    });
  }
  req.body = { categoryName, categoryType };
  next();
};

export const validateAddItem = (req, res, next) => {
  const imageFile = req.file;
  const item = JSON.parse(req.body.itemData);

  // validate image file
  if (!imageFile) {
    return res
      .status(400)
      .json({ success: false, message: "Image file is required" });
  }

  // validate string fields
  const stringFields = ["name", "brand", "description"];
  for (const field of stringFields) {
    if (typeof item[field] !== "string" || item[field].trim() === "") {
      return res.status(400).json({
        success: false,
        message: `${field} is required.`,
      });
    }
    // trim the field
    item[field] = item[field].trim();
  }

  // validate numeric fields
  const { name, brand, description, ...numericFields } = item;
  for (const [key, value] of Object.entries(numericFields)) {
    // validate missing value
    if (
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "")
    ) {
      return res.status(400).json({
        success: false,
        message: `${key} is required.`,
      });
    }

    // validate non-numeric or negative values
    const numValue = Number(value);
    if (Number.isNaN(numValue) || numValue < 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid value for ${key}`,
      });
    }
    item[key] = numValue;
  }
  req.body.itemData = item;
  next();
};

export const validateItemId = (req, res, next) => {
  const itemId = req.params.itemId?.trim();

  if (!itemId || isNaN(itemId)) {
    return res.status(400).json({ success: false, message: "Invalid item ID" });
  }
  req.body = { ...req.body, itemId };
  next();
};

export const validateUpdateItem = (req, res, next) => {
  const item = JSON.parse(req.body.itemData);
  const { itemId } = req.params;
  item.itemId = itemId;

  // validate string fields
  for (const field of ["name", "brand", "description"]) {
    if (typeof item[field] !== "string" || item[field].trim() === "") {
      return res.status(400).json({
        success: false,
        message: `${field} is required.`,
      });
    }
    // trim the field
    item[field] = item[field].trim();
  }

  // validate numeric fields
  const { name, brand, description, ...numericFields } = item;
  for (const [key, value] of Object.entries(numericFields)) {
    // validate missing value
    if (
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "")
    ) {
      return res.status(400).json({
        success: false,
        message: `Missing value for ${key}`,
      });
    }

    // validate non-numeric or negative values
    const numValue = Number(value);
    if (Number.isNaN(numValue) || numValue < 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid value for ${key}`,
      });
    }
    item[key] = numValue;
  }
  req.body.itemData = item;
  next();
};

export const validateCreateCoupon = (req, res, next) => {
  const {
    code,
    discountType,
    discountValue,
    expiryDate,
    usageLimit,
    userGroup,
  } = req.body;

  // validate string fields
  for (const [key, value] of Object.entries({
    code,
    discountType,
    expiryDate,
    userGroup,
  })) {
    if (typeof value !== "string" || value.trim() === "") {
      return res.status(400).json({
        success: false,
        message: `Missing or invalid value for field: ${key}`,
      });
    }
    req.body[key] = value.trim();
  }

  // validate numeric fields
  for (const [key, value] of Object.entries({ discountValue, usageLimit })) {
    if (
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "")
    ) {
      return res.status(400).json({
        success: false,
        message: `Missing value for field: ${key}`,
      });
    }

    const numValue = Number(value);
    if (Number.isNaN(numValue) || numValue < 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid value for field: ${key}`,
      });
    }
    req.body[key] = numValue;
  }
  next();
};
