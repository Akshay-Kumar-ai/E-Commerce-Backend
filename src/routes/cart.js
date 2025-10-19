const express = require("express");
const cartRouter = express.Router();
const Cart = require("../models/cart");
const Product = require("../models/product");
// const product = require("../models/product");
const { userAuth } = require("../middlewares/auth");
const ProductPayment = require("../models/productPayment");

cartRouter.post("/addtocart", userAuth, async (req, res) => {
  try {
    const { user_Id, productId, size, quantity, price, oldPrice } = req.body;

    //Finding User in Cart model
    // const cart = await Cart.findOne({ user: user_Id });

    //Validating product is existing or not
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).send("Error : Product not found");
    }
    //Updating the existing cart
    const updatedCart = await Cart.findOneAndUpdate(
      {
        "user": user_Id,
        "items.product": productId,
        "items.size": size,
      },
      {
        $inc: { "items.$.quantity": quantity }, // increases quantity the quantity you shared
      },
      { new: true }
    );

    if (updatedCart) {
      return res.status(200).json(updatedCart);
    }

    //If not found the item then push new one
    const cart = await Cart.findOneAndUpdate(
      { user: user_Id },
      {
        $push: {
          items: { product: productId, size, quantity, price, oldPrice },
        },
      },
      { new: true, upsert: true } // creates a cart if not exists
    );

    res.status(200).json(cart);
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

cartRouter.post("/decrease", userAuth, async (req, res) => {
  try {
    const { user_Id, productId, size, quantity } = req.body;

    // Decrease quantity
    const updatedCart = await Cart.findOneAndUpdate(
      {
        user: user_Id,
        "items.product": productId,
        "items.size": size,
      },
      {
        $inc: { "items.$.quantity": -quantity }, // subtract quantity
      },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).send("Item not found in cart");
    }

    // Now clean up items where quantity <= 0
    await Cart.updateOne(
      { user: user_Id },
      { $pull: { items: { quantity: { $lte: 0 } } } }
    );

    const finalCart = await Cart.findOne({ user: user_Id });
    res.status(200).json(finalCart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

cartRouter.delete("/remove", userAuth, async (req, res) => {
  try {
    const { user_Id, productId, size } = req.body;

    const updatedCart = await Cart.findOneAndUpdate(
      { user: user_Id },
      {
        $pull: { items: { product: productId, size } },
      },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).send("Cart not found or item missing");
    }

    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

cartRouter.delete("/clear/:userId", userAuth, async (req, res) => {
  try {
    const { userId } = req.params;

    const clearedCart = await Cart.findOneAndUpdate(
      { user: userId },
      { $set: { items: [] } }, // empty the items array
      { new: true }
    );

    if (!clearedCart) {
      return res.status(404).send("Cart not found");
    }

    res.status(200).json({
      message: "Cart cleared successfully",
      cart: clearedCart,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

cartRouter.get("/getcart/:userId", userAuth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId })
      .populate("items.product", "name price") // populating product details
      .lean();

    if (!cart) {
      return res.status(404).send("Cart not found");
    }

    // 🔹 Calculate totals
    let totalQuantity = 0;
    let totalPrice = 0;
    let discountedPrice = 0;

    cart.items.forEach((item) => {
      totalQuantity += item.quantity;
      totalPrice += item.quantity * item.price; // price stored in cart
      discountedPrice += item.quantity * item.oldPrice;
    });

    res.status(200).json({
      cart,
      summary: {
        totalQuantity,
        totalPrice,
        discountedPrice,
      },
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = cartRouter;
