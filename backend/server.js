import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import adminAuthRoutes from "./routes/auth/adminAuth.js";
import customerAuthRoutes from "./routes/auth/customerAuth.js";
import customerRoutes from "./routes/customer.js";
import staffTypeRoutes from "./routes/staffType.js";
import staffUserRoutes from "./routes/staffUser.js";
import categoryRoutes from "./routes/category.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: [process.env.CLIENT_ADMIN_URL, process.env.CLIENT_CUSTOMER_URL],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

//auth routes
app.use("/api/auth/admin", adminAuthRoutes);
app.use("/api/auth/customer", customerAuthRoutes);

app.use("/api/customer", customerRoutes);
app.use("/api/staff_type", staffTypeRoutes);
app.use("/api/staff_user", staffUserRoutes);
app.use("/api/category", categoryRoutes);

//for test
app.get("/", async (req, res) => {
  res.json("API is working");
});

const server = app.listen(port, () => {
  console.log("Server started on port: " + server.address().port);
});
