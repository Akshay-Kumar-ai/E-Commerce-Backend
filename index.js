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
app.use("/", authRouter);
app.use("/", productRouter);
app.use("/", cartRouter);
app.use("/", profileRouter);
connectDB()
  .then(() => {
    console.log("DB Connected");
    app.listen(process.env.PORT_NO, () => console.log("Listening at 8000"));
  })
  .catch((err) => {
    console.error("DB cannot be connected");
  });
