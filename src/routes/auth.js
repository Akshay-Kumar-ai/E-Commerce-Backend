const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");

const ProductUser = require("../models/productUser");
const bcrypt = require("bcrypt");

authRouter.post("/user-signup", async (req, res) => {
  try {
    const { name, emailId, password } = req.body;
    validateSignUpData(req);
    const passwordHash = await bcrypt.hash(password, 10);

    const userObj = {
      name,
      emailId,
      password: passwordHash,
    };
    const user = new ProductUser(userObj);
    const savedUser = await user.save();

    const token = await user.getJWT();

    res.cookie("token", token);
    res.json({ message: "User added succesfully", data: savedUser });
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

authRouter.post("/user-login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    console.log("Body:", req.body);
    const user = await ProductUser.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid Credentials");
    } else {
      const isPasswordValid = await user.validatePassword(password);
      if (isPasswordValid) {
        const token = await user.getJWT();
        res.cookie("token", token);
        res.send(user);
      } else {
        throw new Error("Invalid Credentials");
      }
    }
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

authRouter.post("/become-seller", async (req, res) => {
  try {
    const { userId } = req.body; // userId from frontend (Redux)
    if (!userId) return res.status(400).json({ message: "User not logged in" });

    const user = await ProductUser.findByIdAndUpdate(
      userId,
      { isSeller: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Seller status activated", data: user });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error: " + err.message });
  }
});

authRouter.post("/user-logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout Succesfully");
});

module.exports = authRouter;
