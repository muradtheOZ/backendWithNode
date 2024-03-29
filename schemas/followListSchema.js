const mongoose = require("mongoose");

const followListSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  following:{
    type: mongoose.Types.ObjectId,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

module.exports = followListSchema;
