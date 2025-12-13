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

export const getAllItems = async (req, res) => {};

export const getItem = async (req, res) => {};
