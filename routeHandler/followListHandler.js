const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const followListSchema = require("../schemas/followListSchema");
const FollowList = new mongoose.model("FollowList", followListSchema);
const followPageSchema = require("../schemas/followPageSchema");
const FollowPage = new mongoose.model("FollowPage", followPageSchema);
const postSchema = require("../schemas/postSchema");
const Post = new mongoose.model("Post", postSchema);
const userSchema = require("../schemas/userSchema");
const User = new mongoose.model("User", userSchema);
const checkLogin = require("../middlewares/checkLogin");
const ObjectId = require("mongodb").ObjectId;

//follow person
router.post("/follow/person/:personId", checkLogin, async (req, res) => {
  if (req.params.personId.toString().length < 24) {
    res.status(500).json({
      message: "Person does not exist(wrong BSON!)",
    });
  } else {
    const currentUser = await User.find({ _id: req.userId });
    if (currentUser[0].followingList.includes(req.params.personId)) {
      res.status(500).json({
        message: "You already follow this person",
      });
    } else if (req.params.personId == req.userId) {
      res.status(500).json({
        message: "Why follow yourself!🙄. Sorry we can't do that",
      });
    } else {
      const newFollowList = new FollowList({
        userId: req.userId,
        following: ObjectId(req.params.personId),
      });
      await newFollowList.save((err) => {
        if (err) {
          res.status(500).json({
            error: "There was a server side error!",
          });
        } else {
          res.status(200).json({
            message: "Successfully followed the person",
          });
        }
      });

      // adding the follower list data on every post that user has
      await Post.updateMany(
        { userId: req.params.personId },
        {
          $push: { followerId: newFollowList },
        }
      );
      await User.updateOne(
        { _id: req.userId },
        {
          $push: { followingList: newFollowList.following },
        }
      );
    }
  }
});

//follow page

router.post("/follow/page/:pageId", checkLogin, async (req, res) => {
  if (req.params.pageId.toString().length < 24) {
    res.status(500).json({
      message: "Page does not exist(wrong BSON!)",
    });
  } else {
    const currentUser = await User.find({ _id: req.userId });
    if (currentUser[0].followingList.includes(req.params.pageId)) {
      res.status(500).json({
        message: "You already follow this page",
      });
    } else {
      const newFollowPage = new FollowPage({
        userId: req.userId,
        following: ObjectId(req.params.pageId),
      });
      await newFollowPage.save((err) => {
        if (err) {
          res.status(500).json({
            error: "There was a server side error!",
          });
        } else {
          res.status(200).json({
            message: "Successfully followed the page",
          });
        }
      });
      // adding the follower list data on every post that page has
      await Post.updateMany(
        { userId: req.userId },
        {
          $push: { followerId: newFollowPage },
        }
      );
      await User.updateOne(
        { _id: req.userId },
        {
          $push: { followingList: newFollowPage.following },
        }
      );
    }
  }
});

module.exports = router;
