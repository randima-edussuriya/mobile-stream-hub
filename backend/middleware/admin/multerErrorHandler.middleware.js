import multer from "multer";

const multerErrorHandler = (err, req, res, next) => {
  // Multer-specific errors
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        return res.status(400).json({
          success: false,
          message: "File size exceeds allowed limit 1MB.",
        });

      case "LIMIT_UNEXPECTED_FILE":
        return res.status(400).json({
          success: false,
          message: "Invalid file type or unexpected file field.",
        });

      default:
        return res.status(400).json({
          success: false,
          message: err.message || "File upload error.",
        });
    }
  }

  // Custom or general errors
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || "Upload failed.",
    });
  }

  next();
};

export default multerErrorHandler;
