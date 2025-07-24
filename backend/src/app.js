const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes/index");
const errorHandler = require("./middleware/errorHandler");
const path = require("path");

const app = express();

// for middleware
app.use(cors());
app.use(express.json());

app.use("/v2/api", apiRoutes);

// serve images from the src/uploads dir
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

// for middleware Error handler
app.use(errorHandler);

module.exports = app;
