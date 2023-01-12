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

router.route("/login").get(api, validateLogin, auth.login);

router.route("/register").get(api, validateRegistration, auth.register);

router.route("/sendCode").get(api, validatePhone, auth.sendCode);

router
  .route("/verifyCode")
  .get(api, validatePhone, validateCode, auth.verifyCode);

module.exports = router;
