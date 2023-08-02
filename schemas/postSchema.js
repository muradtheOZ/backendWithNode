const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  userId:{
    type: String
  },
  ownerId:{
    type: String
  },
  pageId:{
    type: String
  },
  followerId:[{
    type: Object
  }
    
  ],
  date: {
    type: Date,
    default: Date.now,
  }
});

module.exports = postSchema;
