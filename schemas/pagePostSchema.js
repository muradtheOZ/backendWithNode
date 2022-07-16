const mongoose = require("mongoose");

const pagePostSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  userId:{
    type: String
  },
  pageId:{
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = pagePostSchema;
