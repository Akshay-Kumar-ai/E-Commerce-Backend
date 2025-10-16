const express = require("express");
const productRouter = express.Router();
const Product = require("../models/product");

productRouter.post("/addproducts", async (req, res) => {
  try {
    const {
      name,
      brand,
      description,
      category,
      photoUrl,
      variants,
      rating,
    } = req.body;
    console.log(req.body);
    const product = new Product(req.body);
    await product.save();
    res.send("Product added successfully");
  } catch (err) {
    res.status(err).send("Error : " + err.message);
  }
});

productRouter.get("/allProducts", async (req, res) => {
  try {
    const products = await Product.find();

    res.json(products);
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

productRouter.get("/men", async (req, res) => {
  try {
    const products = await Product.find({ category: "Men" });

    res.json(products);
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});
productRouter.get("/women", async (req, res) => {
  try {
    const products = await Product.find({ category: "Women" });

    res.json(products);
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});
productRouter.get("/kids", async (req, res) => {
  try {
    const products = await Product.find({ category: "Kids" });

    res.json(products);
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});
module.exports = productRouter;
