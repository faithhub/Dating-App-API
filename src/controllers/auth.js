const { User } = require("../db/sequelize");
const config = require("../db/config/config.json");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function hashIt(password) {
  const salt = await bcrypt.genSalt(6);
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
}

async function compareIt(password, hashedPassword) {
  const validPassword = await bcrypt.compare(password, hashedPassword);
  return validPassword;
}

async function login(req, res) {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({
      where: { phone },
      raw: true,
      nest: true,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const checkPassword = await compareIt(password, user.password);

    if (!checkPassword) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ sub: user.phone }, config.secret, {
      expiresIn: "7d",
    });

    delete user.password;
    res.status(200).json({
      message: "User logged in successfully",
      data: { ...user, token },
    });
  } catch (error) {
    return res.status(400).json({
      message: "An error occur",
      error: error.message,
    });
  }
}

async function register(req, res) {
  try {
    const { phone } = req.body;

    const checkPhone = await User.count({
      where: { phone },
    });

    if (checkPhone > 0) {
      return res.status(400).json({
        message: "The phone already exists",
      });
    }

    const password = await hashIt(req.body.password);
    const createUser = await User.create({ phone, password });

    if (!createUser) {
      return res.status(400).json({
        message: "An error occur when creating a new User",
      });
    }

    return res.status(200).json({
      message: "User created successfully",
      data: createUser,
    });
  } catch (error) {
    return res.status(400).json({
      message: "An error occur",
      error: error.message,
    });
  }
}

module.exports = { login, register };
