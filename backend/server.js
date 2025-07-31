require("dotenv").config();
const app = require("./src/app");
const db = require("./src/db");
const { seedAll } = require("./src/utils/seedData");

db()

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`server running on port ${port} in ${process.env.NODE_ENV}Mode.`);
});

// for handling promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("shutting down the server due to unhandled promise rejection");
  server.close(() => {
    process.exit(1);
  });
});
