const apis = require("../constant/apis.json");
const { User } = require("../db/sequelize");
const config = require("../db/config/config.json");
const jwt = require("jsonwebtoken");

module.exports = async function api(req, res, next) {
  try {
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
      return res.status(403).json({
        message: "A token is required for authentication",
      });
    }

    const verifyToken = jwt.verify(token, config.secret);

    if (!verifyToken) {
      return res.status(403).json({
        message: "Invalid token",
      });
    }
    req.user = verifyToken;
    return next();
  } catch (e) {
    return res.status(401).json({
      error: e.message,
      message: "Invalid token",
    });
  }
};
