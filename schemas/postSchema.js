const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  content: {
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

module.exports = postSchema;
