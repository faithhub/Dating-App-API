const api = require("../middlewares/api");
const { urlencoded } = require("express");
const auth = require("../middlewares/auth");
const postController = require("../controllers/post");
const express = require("express");
const router = express.Router();
const { createPost } = require("../services/validations/post");
const multer = require("multer");
const upload = multer();
const uploadFile = require("../middlewares/upload");

router.route("/").get(api, auth, postController.getPosts);

router.route("/:id").get(api, auth, postController.getPost);

router.route("/:id").delete(api, auth, postController.deletePost);

router.route("/like/:id").get(api, auth, postController.likePost);

router.route("/unlike").get(api, auth, postController.likePost);

router
  .route("/")
  .post(api, auth, createPost, uploadFile, postController.create);

module.exports = router;
