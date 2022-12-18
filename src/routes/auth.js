const api = require("../middlewares/apiAuth");
const auth = require("../controllers/auth");
const express = require("express");
const router = express.Router();
const {
  validateRegistration,
  validateLogin,
} = require("../services/validations/auth");

router.route("/login").get(api, validateLogin, auth.login);

router.route("/register").get(api, validateRegistration, auth.register);

module.exports = router;
