const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const postSchema = require("../schemas/postSchema");
const Post = new mongoose.model("Post", postSchema);
const followListSchema = require("../schemas/followListSchema");
const FollowList = new mongoose.model("FollowList", followListSchema);
const followPageSchema = require("../schemas/followPageSchema");
const FollowPage = new mongoose.model("FollowPage", followPageSchema);
const ObjectId = require('mongodb').ObjectId;
const checkLogin = require("../middlewares/checkLogin");

//create a person post
router.post("/person/attach-post",checkLogin,async (req, res) => {
  const data =  await FollowList.find({following: req.userId})
    
     const newPost =  new Post({
      "userId":req.userId,
      "content":req.body.content,
      "followerId":data
    });
    console.log(newPost.followerId.map(item => item.userId))
    
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

  //create a new page post
router.post("/page/:pageId/attach-post",checkLogin,async (req, res) => {
  const data =  await FollowPage.find({following: req.params.pageId})
    const newPost = new Post({
      "userId":req.userId,
      "pageId":ObjectId(req.params.pageId),
      "content":req.body.content,
      "followerId":data
    });
    
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