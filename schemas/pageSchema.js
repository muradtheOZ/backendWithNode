const mongoose = require("mongoose");

const pageSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userId:{
    type: String
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

module.exports = pageSchema;
