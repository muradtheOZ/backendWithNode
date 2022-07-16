const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const postSchema = require("../schemas/postSchema");
const Post = new mongoose.model("Post", postSchema);
const checkLogin = require("../middlewares/checkLogin");

//create a post
router.post("/person/attach-post",checkLogin, (req, res) => {
    const newPost = new Post({
      "userId":req.userId,
      "content":req.body.content,
    });
    // console.log(req.email,req.userId)
    newPost.save((err) => {
      if (err) {
        res.status(500).json({
          error: "There was a server side error!",
        });
      } else {
        res.status(200).json({
          message: "Post was created successfully",
        });
      }
    });
  });
  module.exports = router;