const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  userId:{
    type: String
  },
  followerId:[{
    userId: {
      type: mongoose.Types.ObjectId,
    },
    following:{
      type: mongoose.Types.ObjectId,
    }
  }
],
  date: {
    type: Date,
    default: Date.now,
  }
});

module.exports = postSchema;
