const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const postSchema = require("../schemas/postSchema");
const pagePostSchema = require("../schemas/pagePostSchema");
const Post = new mongoose.model("Post", postSchema);
const PagePost = new mongoose.model("PagePost", pagePostSchema);
const followListSchema = require("../schemas/followListSchema");
const FollowList = new mongoose.model("FollowList", followListSchema);
const ObjectId = require('mongodb').ObjectId;
const checkLogin = require("../middlewares/checkLogin");

//create a person post
router.post("/person/attach-post",checkLogin,async (req, res) => {
  const data =  await FollowList.find({following: req.userId})
    // console.log(data)
     const newPost =  new Post({
      "userId":req.userId,
      "content":req.body.content,
      "followerId":data
    });
    console.log(newPost.followerId.map(item => item.userId))
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

  //create a a page post
router.post("/page/:pageId/attach-post",checkLogin, (req, res) => {
    const newPagePost = new PagePost({
      "userId":req.userId,
      "pageId":ObjectId(req.params.pageId),
      "content":req.body.content
    });
    // console.log(req.email,req.userId)
    newPagePost.save((err) => {
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