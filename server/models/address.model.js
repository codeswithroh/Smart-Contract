const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    trim: true,
  },
});

const Address =
  mongoose.models.Address || mongoose.model("Address", addressSchema);

module.exports = Address;
