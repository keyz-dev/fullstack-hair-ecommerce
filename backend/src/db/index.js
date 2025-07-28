const mongoose = require('mongoose');
const isProductionMode = process.env.NODE_ENV === 'production'

const DB_URI = isProductionMode ? process.env.DB_PROD_URL : process.env.DB_DEV_URL;
const db = async () => {
  try {
    const { connection } = await mongoose.connect(DB_URI);

    console.log(`server connected to database ${connection.host}`);
  } catch (error) {
    console.log('error occur on databate side ' + error);
    console.log('shutting down the server due to error');

    process.exit(1);
  }
};

module.exports = db;
