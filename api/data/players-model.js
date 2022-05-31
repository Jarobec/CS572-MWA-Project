const mongoose = require("mongoose");

const playerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    min: 16,
    max: 99,
    required: true,
  },
});

module.exports = playerSchema;
