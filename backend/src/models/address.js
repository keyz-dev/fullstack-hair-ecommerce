const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
  },  
  address: String,
  postalCode: String,
  state: String,
  country: {
    type: String,
    default: 'Cameroon',
  },
});

module.exports = addressSchema; 