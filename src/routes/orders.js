const express = require("express");
const orderRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ProductPayment = require("../models/productPayment");

orderRouter.get("/orders", userAuth, async (req, res) => {
  try {
    // const { userId } = req.params;

    const orders = await ProductPayment.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = orderRouter;
