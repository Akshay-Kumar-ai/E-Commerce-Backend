const mongoose = require("mongoose");
const validator = require("validator");
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique:true
  },
  brand: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: {
      values: ["Men", "Women", "Kids"],
    },
  },
  photoUrl: {
    type: String,
    validate(value) {
      if (!validator.isURL(value)) {
        throw new Error("Invalid Photo URL");
      }
    },
  },
  variants: {
    type: Map,
    of: new mongoose.Schema(
      {
        price: { type: Number, required: true },
        old_price: Number,
        new_price: Number,
        stock: { type: Number, default: 0 },
      },
      { _id: false } // prevents auto _id for subdocuments
    ),
  },
  rating: {
    type: Number,
  },
});

module.exports = mongoose.model("Product", productSchema);

// {
//   "name": "Round Neck T-Shirt",
//   "brand": "Nike",
//   "description": "Comfort fit cotton t-shirt",
//   "variants": {
//     "S": { "price": 499, "old_price": 699, "stock": 10 },
//     "M": { "price": 549, "old_price": 749, "stock": 15 }
//   }
// }

// const product = await Product.findById(id);
// console.log(product.variants.get("S").price); // 499
