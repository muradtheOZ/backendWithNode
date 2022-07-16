const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const followListSchema = require("../schemas/followListSchema");
const FollowList = new mongoose.model("FollowList", followListSchema);
const followPageSchema = require("../schemas/followPageSchema");
const FollowPage = new mongoose.model("FollowPage", followPageSchema);
const checkLogin = require("../middlewares/checkLogin");
const ObjectId = require('mongodb').ObjectId;

//follow person
router.post("/follow/person/:personId",checkLogin, async(req, res) => {
    const newFollowList = new FollowList({
      "userId":req.userId,
      "following":ObjectId(req.params.personId)
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
  });

  //follow page

  router.post("/follow/page/:pageId",checkLogin, async(req, res) => {
    const newFollowPage = new FollowPage({
      "userId":req.userId,
      "following":ObjectId(req.params.pageId)
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
  });

  module.exports = router;