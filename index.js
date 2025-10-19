const express = require("express");
const connectDB = require("./src/config/database");
const app = express();
const cors = require("cors");

const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./src/routes/auth");
const productRouter = require("./src/routes/product");
const cartRouter = require("./src/routes/cart");
const profileRouter = require("./src/routes/profile");
const paymentRouter = require("./src/routes/payment");
const orderRouter = require("./src/routes/orders");
app.use("/api", authRouter);
app.use("/api", productRouter);
app.use("/api", cartRouter);
app.use("/api", profileRouter);
app.use("/api", paymentRouter);
app.use("/api", orderRouter);

// app.use("/api/auth", authRouter);
// app.use("/api/products", productRouter);
// app.use("/api/cart", cartRouter);
// app.use("/api/profile", profileRouter);

connectDB()
  .then(() => {
    console.log("DB Connected");
    app.listen(process.env.PORT_NO, () => console.log("Listening at 5000"));
  })
  .catch((err) => {
    console.error("DB cannot be connected");
  });
