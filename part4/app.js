const express = require("express");
const cors = require("cors");
require("express-async-errors");
const app = express();
app.use(cors());
const logger = require("./utils/logger");
const config = require("./utils/config");
const middleware = require("./utils/middleware");

const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

const mongoose = require("mongoose");
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connect to MongoDB");
  })
  .catch((error) => {
    logger.error("error connect to MongnDB:", error.message);
  });

app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);
app.use("/api/blogs", middleware.userExtractor, blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

app.use(middleware.errorHandler);
app.use(middleware.unknownEndpoint);

module.exports = app;
