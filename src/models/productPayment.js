const mongoose = require("mongoose");
const product = require("./product");
const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductUser",
      required: true,
    },

    paymentId: {
      type: String,
    },
    orderId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    receipt: {
      type: String,
      required: true,
    },
    notes: {
      userName: {
        type: String,
      },
      products: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          name: { type: String, required: true },
          price: { type: Number, required: true },
          quantity: { type: Number, required: true },
          size: { type: String, required: true },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model("ProductPayment", paymentSchema);

//BY GPT
// mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     orderId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Order",
//       required: true,
//     },

//     // 🛍️ Purchased Items
//     items: [
//       {
//         productId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Product",
//           required: true,
//         },
//         name: { type: String, required: true }, // Store name so it doesn't change
//         price: { type: Number, required: true },
//         quantity: { type: Number, required: true },
//         image: { type: String }, // Optional (thumbnail or image URL)
//       },
//     ],

//     // Payment Gateway (Razorpay/Stripe/PayPal/COD)
//     paymentProvider: {
//       type: String,
//       enum: ["razorpay", "stripe", "paypal", "cod"],
//       required: true,
//     },

//     paymentId: {
//       type: String,
//       default: null,
//     },

//     paymentSignature: {
//       type: String,
//       default: null,
//     },

//     status: {
//       type: String,
//       enum: ["pending", "success", "failed", "refunded"],
//       default: "pending",
//     },

//     amount: {
//       type: Number,
//       required: true,
//     },

//     currency: {
//       type: String,
//       default: "INR",
//     },

//     method: {
//       type: String, // card, netbanking, upi, wallet, cod
//       default: null,
//     },

//     paymentDetails: {
//       type: Object,
//       default: {},
//     },

//     gatewayResponse: {
//       type: Object,
//       default: {},
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Payment", paymentSchema);

//Example code
// {
//   "userId": "67a90ff3db...",
//   "orderId": "67a910e37a...",
//   "items": [
//     {
//       "productId": "67a7b23a8c...",
//       "name": "Nike Air Max",
//       "price": 4999,
//       "quantity": 1,
//       "image": "https://example.com/nike.jpg"
//     },
//     {
//       "productId": "67a7b2af5e...",
//       "name": "Adidas T-Shirt",
//       "price": 1499,
//       "quantity": 2,
//       "image": "https://example.com/adidas.jpg"
//     }
//   ],
//   "paymentProvider": "razorpay",
//   "paymentId": "pay_Kl54L9...",
//   "status": "success",
//   "amount": 7997,
//   "currency": "INR"
// }
