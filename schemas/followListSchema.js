const mongoose = require("mongoose");

const followListSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  followersId:{
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

module.exports = followListSchema;
