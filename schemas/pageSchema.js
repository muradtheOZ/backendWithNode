const mongoose = require("mongoose");

const pageSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userId:{
    type: String
  },
  followerId:[
    {
      type: mongoose.Types.ObjectId,
      ref: "FollowList",
    }
],
  date: {
    type: Date,
    default: Date.now,
  }
});

module.exports = pageSchema;
