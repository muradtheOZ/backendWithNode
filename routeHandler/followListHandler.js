const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const followListSchema = require("../schemas/followListSchema");
const FollowList = new mongoose.model("FollowList", followListSchema);
const checkLogin = require("../middlewares/checkLogin");

router.post("/follow/person/:personId",checkLogin, async(req, res) => {
    const newFollowList = new FollowList({
      "userId":req.userId,
      "following":req.params.personId
    });
    // console.log(req.email,req.userId)
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

  module.exports = router;