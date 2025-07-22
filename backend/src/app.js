const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const apiRoutes = require("./routes/index");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// for middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/v2/api", apiRoutes);

// for middleware Error handler
app.use(errorHandler);

module.exports = app;
