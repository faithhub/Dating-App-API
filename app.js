const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const server = require("http").createServer(app);
const routes = require("./src/routes");
const generateApiKey = require("generate-api-key").default;
const { sequelize } = require("./src/db/sequelize");
app.use(morgan("dev"));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", routes);
// console.log(today, generateApiKey({ method: "uuidv4", dashes: false }));

// app.use("/", function (req, res, next) {
//   res.status(200).json({
//     message: "It's working now",
//   });
// });

app.use((req, res, next) => {
  const error = new Error("Page not found");
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

const port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log("I'm listening on port %s", port);
  // sequelize
  //   .authenticate()
  //   .then(() => console.log("Database connected!!"))
  //   .catch((err) => console.log(err));
});

module.exports = app;
