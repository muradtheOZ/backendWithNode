const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const postSchema = require("../schemas/postSchema");
const Post = new mongoose.model("Post", postSchema);
const followListSchema = require("../schemas/followListSchema");
const FollowList = new mongoose.model("FollowList", followListSchema);
const followPageSchema = require("../schemas/followPageSchema");
const FollowPage = new mongoose.model("FollowPage", followPageSchema);
const pageSchema = require("../schemas/pageSchema");
const Page = new mongoose.model("Page", pageSchema);
const ObjectId = require("mongodb").ObjectId;
const checkLogin = require("../middlewares/checkLogin");

//create a person post
router.post("/person/attach-post", checkLogin, async (req, res) => {
  const data = await FollowList.find({ following: req.userId });

  const newPost = new Post({
    userId: req.userId,
    content: req.body.content,
    followerId: data,
  });
  console.log(newPost.followerId.map((item) => item.userId));

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
router.post("/page/:pageId/attach-post", checkLogin, async (req, res) => {
  //checking page BSON is in right formate or not for stooping it from crashing.
  if ((req.params.pageId).toString().length < 24) {
    res.status(500).json({
      message: "Page does not exist(wrong BSON!)",
    });
  }
  else{
    const pageIsValid = await Page.find({ _id: req.params.pageId });
    console.log(pageIsValid, pageIsValid.length,(pageIsValid[0]._id).toString().length);
    //checking is the page exist in database or not
    if (pageIsValid.length >= 1) {
      //checking loggedIn person is owner of the page or not
      if (pageIsValid[0].userId == req.userId) {
        const data = await FollowPage.find({ following: req.params.pageId });
        const newPost = new Post({
          userId: ObjectId(req.params.pageId),
          content: req.body.content,
          followerId: data,
        });
  
        await newPost.save((err) => {
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
      } else {
        res.status(500).json({
          message: "You are not authorized to post on this page",
        });
      }
    
    } else {
      res.status(500).json({
        message: "please give correct page Id",
      });
    }
  }
  
});
module.exports = router;
