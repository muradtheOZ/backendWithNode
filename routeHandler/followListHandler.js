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
const pageSchema = require("../schemas/pageSchema");
const Page = new mongoose.model("Page", pageSchema);
const checkLogin = require("../middlewares/checkLogin");
const ObjectId = require("mongodb").ObjectId;

//follow person
router.post("/follow/person/:personId", checkLogin, async (req, res) => {
  //checking provided person Id is in Hex format or not
  regexp = /^[0-9a-fA-F]+$/;
  if (regexp.test(req.params.personId)) {
    //checking provided person Id length is perfect or less
    if (req.params.personId.toString().length != 24 && req.params.personId.toString().length != 12) {
      res.status(500).json({
        message: "Person does not exist(BSON string size mismatch)",
      });
    } else {
      const currentUser = await User.find({ _id: req.userId });
      const wantToFollow = await User.find({ _id: req.params.personId });

      //checking logged in user existed in the database or not
      if (currentUser.length == 0) {
        res.status(500).json({
          message:
            "Are you really a user! we could not find you in our database",
        });
      }

      //check following user existed in database or not
      if (wantToFollow.length == 0) {
        res.status(500).json({
          message:
            "Who you want to follow! we could not find that user in our database",
        });
      } else {
        //checking if the user already followed or not
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
          // adding the follower list data under user
          await User.updateOne(
            { _id: req.userId },
            {
              $push: { followingList: newFollowList.following },
            }
          );
        }
      }
    }
  } else {
    res.status(500).json({
      message: "Page does not exist(wrong BSON!)",
    });
  }
});

//follow page

router.post("/follow/page/:pageId", checkLogin, async (req, res) => {
  //checking provided page Id is in Hex format or not

  regexp = /^[0-9a-fA-F]+$/;

  if (regexp.test(req.params.pageId.toString())) {
    if (req.params.pageId.toString().length != 24 && req.params.pageId.toString().length != 12) {
      //checking provided page Id length is right or wrong
      res.status(500).json({
        message: "this is not a valid page Id(BSON string size mismatch)",
      });
    } else {
      const currentUser = await User.find({ _id: req.userId });
      const wantToFollow = await Page.find({ _id: req.params.pageId });
      console.log(wantToFollow.length);
      //checking logged in  user existed in the database or not
      if (currentUser.length == 0) {
        res.status(500).json({
          message: "You are not logged in! I could not find your name!",
        });
      }
      //check following page existed in database or not
      if (wantToFollow.length == 0) {
        res.status(500).json({
          message:
            "Which page you want to follow! we could not find that user in our database",
        });
      } else {
        //checking if the page is already followed or not
        if (wantToFollow[0]?.followerId.includes(req.userId)) {
          res.status(500).json({
            message: "You already follow this page",
          });
        }
        if (wantToFollow[0]?.userId.includes(req.userId)) {
          res.status(500).json({
            message: "Why you want to follow your own page 🙄. Sorry we can't do that",
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
          await Post.updateOne(
            { pageId: req.params.pageId },
            {
              $push: { followerId: newFollowPage },
            }
          );
          await Page.updateOne(
            { _id: req.params.pageId },
            {
              $push: { followerId: newFollowPage.following },
            }
          );
        }
      }
    }
  } else {
    res.status(500).json({
      message: "this is not a valid page Id(wrong string!)",
    });
  }
});

module.exports = router;
