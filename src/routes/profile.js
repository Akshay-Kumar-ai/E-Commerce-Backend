// in profile.js (router)
const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

// ✅ Protected route (user is already attached by userAuth)
profileRouter.get("/user-profile", userAuth, async (req, res) => {
  try {
    // req.user is set in userAuth middleware
    res.json(req.user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = profileRouter;
