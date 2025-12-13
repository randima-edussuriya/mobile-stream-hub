import fs from "fs";
import imageKit from "../../config/imageKit.js";
import dbPool from "../../config/dbConnection.js";

export const addItem = async (req, res) => {
  try {
    const imageFile = req.file;
    const item = req.body.itemData;

    // upload image to ImageKit
    const response = await imageKit.files.upload({
      file: fs.createReadStream(imageFile.path),
      fileName: imageFile.originalname,
      folder: "/mobile-stream-hub/items",
    });

    // delete local file after upload
    fs.unlinkSync(imageFile.path);

    // URL generation with transformations
    const optimizedImageUrl = imageKit.helper.buildSrc({
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
      src: response.filePath,
      transformation: [
        {
          width: 400,
          crop: "maintain_ratio",
          quality: "auto",
          format: "webp",
        },
      ],
    });

    // save to database
    const imgae = optimizedImageUrl;
    const sql =
      "INSERT INTO item (name, image, brand, description, sell_price, cost_price, stock_quantity, discount, warranty_months, reorder_point, supplier_id, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [
      item.name,
      imgae,
      item.brand,
      item.description,
      item.sellPrice,
      item.costPrice,
      item.stockQuantity,
      item.discountPercentage,
      item.warrantyMonths,
      item.reorderPoint,
      item.supplierId,
      item.categoryId,
    ];
    await dbPool.query(sql, values);
    return res
      .status(201)
      .json({ success: true, message: "Item added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const getAllItems = async (req, res) => {
  try {
    const sql = `
              SELECT i.item_id, i.name, i.image, i.brand, i.sell_price, i.stock_quantity, i.discount, i.reorder_point, c.category_name
              FROM item i
              INNER JOIN category c ON c.category_id=i.category_id
              ORDER BY item_id ASC`;
    const [items] = await dbPool.query(sql);
    return res.status(200).json({ success: true, data: items });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.body;

    // check if item exists
    const [existingItemRows] = await dbPool.query(
      "SELECT 1 FROM item WHERE item_id = ?",
      [itemId]
    );
    if (existingItemRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Item not found.",
      });
    }

    // delete item
    await dbPool.query("DELETE FROM item WHERE item_id = ?", [itemId]);
    return res
      .status(200)
      .json({ success: true, message: "Item deleted successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const getItem = async (req, res) => {
  try {
    const { itemId } = req.body;
    const [item] = await dbPool.query("SELECT * FROM item WHERE item_id = ?", [
      itemId,
    ]);
    // check if item exists
    if (item.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Item not found.",
      });
    }

    return res.status(200).json({ success: true, data: item[0] });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
