const { Post, Image, User, Like, Friend } = require("../db/sequelize");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

async function deletePost(req, res) {
  try {
    const { id } = req.params;

    const post = await Post.destroy({
      where: { id, userId: req.user.id },
    });

    if (!post) {
      return res.status(404).json({
        message: "No Post found",
      });
    }

    return res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "An error occur when fetching post",
      error: error.message,
    });
  }
}

async function getPost(req, res) {
  try {
    const { id } = req.params;

    const post = await Post.findAll({
      where: { id, userId: req.user.id },
      include: [
        {
          model: Image,
          as: "image",
          attributes: ["url"],
        },
      ],
    });

    if (!post) {
      return res.status(404).json({
        message: "No Post found",
      });
    }

    return res.status(200).json({
      message: "Post",
      data: post,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "An error occur when fetching post",
      error: error.message,
    });
  }
}

async function getPosts(req, res) {
  try {
    const posts = await Post.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Image,
          as: "image",
          attributes: ["url"],
        },
      ],
    });

    return res.status(200).json({
      message: "All Posts",
      data: posts,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "An error occur when fetching posts",
      error: error.message,
    });
  }
}

async function create(req, res) {
  try {
    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload the Post Image!" });
    }

    const saveImage = await Image.create({
      name: req.file.filename,
      url: req.file.path,
    });

    const createPost = await Post.create({
      imageId: saveImage.id,
      userId: req.user.id,
    });

    const post = await Post.findOne({
      where: { id: createPost.id },
      include: [
        {
          model: Image,
          as: "image",
          attributes: ["url"],
        },
      ],
    });

    return res.status(200).json({
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "An error occur when creating post",
      error: error.message,
    });
  }
}

async function likePost(req, res) {
  try {
    const { id } = req.params;

    // Check if post does exist
    const post = await Post.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id"],
        },
      ],
    });

    if (!post) {
      return res.status(404).json({
        message: "No Post found",
      });
    }

    // Check if already like the post
    const checkLike = await Like.count({
      where: { postId: post.id, userId: req.user.id },
    });

    if (checkLike == 0) {
      // Save like
      await Like.create({
        postId: post.id,
        userId: req.user.id,
      });
      const param = {
        likes: post.likes + 1,
      };
      await Post.update(param, { where: { id } });
    }

    if (checkLike > 0) {
      // Become friend
      await Friend.create({
        userId: req.user.id,
        posterId: post.userId,
      });
    }

    return res.status(200).json({
      message: "Post Liked",
      data: post,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "An error occur when creating post like",
      error: error.message,
    });
  }
}

module.exports = { create, getPosts, getPost, deletePost, likePost };
