const express = require("express");
const paymentRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const razarpayInstance = require("../utils/razorpay");
const ProductPayment = require("../models/productPayment");
const Cart = require("../models/cart");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ msg: "Your cart is empty" });
    }
    //Preparing products array for Razorpay
    const productsForPayment = cart.items.map((item) => ({
      productId: item.product._id,
      name: item.product.name,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
    }));

    //Calculating total amount
    const totalAmount =
      cart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ) * 100; // Convert to paise

    //Creating Order to Razorpay
    const order = await razarpayInstance.orders.create({
      amount: totalAmount,
      currency: "INR",
      receipt: `order_${Date.now()}`,
      notes: {
        userName: req.user.name,
        products: productsForPayment,
      },
    });
    // console.log(req.user);

    //Saving the order in DB
    const payment = new ProductPayment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    const savedPayment = await payment.save();

    res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_ID });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    console.log("Webhook Called");
    const webhookSignature = req.get("X-Razorpay-Signature");
    console.log("Webhook Signature", webhookSignature);
    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if (!isWebhookValid)
      return res.status(400).json({ msg: "Webhook Signature is Invalid" });

    //Updating the payment status in DB
    const paymentDetails = req.body.payload.payment.entity;
    const payment = await ProductPayment.findOne({
      orderId: paymentDetails.order_id,
    });

    payment.status = paymentDetails.status;
    await payment.save();
    console.log("Payment saved");

    return res.status(200).json({ msg: "Webhook Received Successfully" });
  } catch (err) {
    console.error(err);
  }
});

//Api to send responde to frontend
paymentRouter.get("/payment/verify", userAuth, async (req, res) => {
  try {
    // Find the latest payment made by the user
    const latestPayment = await ProductPayment.findOne({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    if (!latestPayment) {
      return res.status(404).json({ msg: "No payment found for this user" });
    }

    // Send payment status and details to frontend
    return res.status(200).json({
      orderId: latestPayment.orderId,
      amount: latestPayment.amount,
      currency: latestPayment.currency,
      status: latestPayment.status, // can be 'created', 'paid', 'failed'
      products: latestPayment.notes.products,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
});

module.exports = paymentRouter;

// {
//   _id: new ObjectId('68b3e3038e4ae1cddc908055'),
//   name: 'Ujjwal Kumar',
//   emailId: 'ujjwal@gmail.com',
//   password: '$2b$10$hoMR02S9Ltk2IrYt4dBFPO8hAR81lteG34SsWnBTDTychcw10ENrS',
//   isSeller: false,
//   createdAt: 2025-08-31T05:52:03.290Z,
//   updatedAt: 2025-08-31T05:52:03.290Z,
//   __v: 0
// }

// {
//     "order": {
//         "amount": 130000,
//         "amount_due": 130000,
//         "amount_paid": 0,
//         "attempts": 0,
//         "created_at": 1760842428,
//         "currency": "INR",
//         "entity": "order",
//         "id": "order_RVApcUivDSc8MJ",
//         "notes": {
//             "products": [
//                 {
//                     "name": "Twill Regular Fit Shirt",
//                     "price": 2510,
//                     "productId": "68de1d4c165052c65d80d053",
//                     "quantity": 2
//                 },
//                 {
//                     "name": "Tailored Fit Tartan Checked Shirt",
//                     "price": 2400,
//                     "productId": "68de1d97165052c65d80d055",
//                     "quantity": 1
//                 }
//             ],
//             "userName": "Akshay"
//         },
//         "offer_id": null,
//         "receipt": "receipt#1",
//         "status": "created"
//     }
// }
