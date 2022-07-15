const mongoose = require("mongoose");

const pageSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  email:{
    type: String,
  }
});

module.exports = pageSchema;
