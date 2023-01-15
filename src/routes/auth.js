const api = require("../middlewares/api");
const auth = require("../controllers/auth");
const express = require("express");
const router = express.Router();
const {
  validateRegistration,
  validateLogin,
  validatePhone,
  validateCode,
} = require("../services/validations/auth");

router.route("/login").post(validateLogin, auth.login);

router.route("/register").post(validateRegistration, auth.register);

router.route("/sendCode").post(validatePhone, auth.sendCode);

router.route("/verifyCode").post(validatePhone, validateCode, auth.verifyCode);

module.exports = router;
