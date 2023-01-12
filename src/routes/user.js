const api = require("../middlewares/api");
const auth = require("../middlewares/auth");
const userController = require("../controllers/user");
const express = require("express");
const router = express.Router();
const { validatePassword } = require("../services/validations/user");

router.route("/").get(api, auth, userController.profile);

router.route("/").patch(api, auth, userController.updateProfile);

router
  .route("/password")
  .patch(api, auth, validatePassword, userController.updatePassword);

module.exports = router;
