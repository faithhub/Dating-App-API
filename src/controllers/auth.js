const { User } = require("../db/sequelize");
const config = require("../db/config/config.json");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const twilioVerify = require("../ultis/twilio/verifyPhone");

async function hashIt(password) {
  const salt = await bcrypt.genSalt(6);
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
}

async function login(req, res) {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({
      where: { phone },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    if (!user.validPassword(password)) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ sub: user.phone, id: user.id }, config.secret, {
      expiresIn: "7d",
    });

    delete user.dataValues.password;
    return res.status(200).json({
      message: "User logged in successfully",
      // user: data,
      data: { ...user.dataValues, token },
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
    const { phone, password } = req.body;

    const checkPhone = await User.count({
      where: { phone },
    });

    if (checkPhone > 0) {
      return res.status(400).json({
        message: "The phone already exists",
      });
    }

    // const password = await hashIt(req.body.password);
    const createUser = await User.create({ phone, password });

    if (!createUser) {
      return res.status(400).json({
        message: "An error occur when creating a new User",
      });
    }

    return res.status(200).json({
      message: "User created successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message: "An error occur",
      error: error.message,
    });
  }
}

async function sendCode(req, res) {
  try {
    const { phone } = req.body;

    const sendCode = await twilioVerify.sendCode(phone);

    return res.status(200).json({
      message: "Code sent",
      data: sendCode,
    });
  } catch (error) {
    return res.status(400).json({
      message: "An error occur",
      error: error.message,
    });
  }
}

async function verifyCode(req, res) {
  try {
    const { phone, code } = req.body;

    const verifyCode = await twilioVerify.verifyCode(phone, code);

    if (!verifyCode) {
      return res.status(400).json({
        message: "Invalid Code",
      });
    }
    return res.status(200).json({
      message: "Code Verified",
      data: verifyCode,
    });
  } catch (error) {
    return res.status(400).json({
      message: "An error occur",
      error: error.message,
    });
  }
}

module.exports = { login, register, sendCode, verifyCode };
