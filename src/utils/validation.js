const validator = require("validator");

const validateSignUpData = (req) => {
  const { name, emailId, password } = req.body;
  if (!name) {
    throw new Error("First Name is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
};

module.exports = { validateSignUpData };
