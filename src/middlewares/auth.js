const jwt = require("jsonwebtoken");
const productUser = require("../models/productUser");

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send("Please Login");
    } else {
      const decodeObj = await jwt.verify(token, process.env.JWT_SECRET);
      const { _id } = decodeObj;
      const user = await productUser.findById(_id);
      if (!user) {
        throw new Error("User not found");
      } else {
        req.user = user; 
        next();
      }
    }
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
};


module.exports = { userAuth };