const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const checkLogin = require("../middlewares/checkLogin");
const postSchema = require("../schemas/postSchema");
const Post = new mongoose.model("Post", postSchema);


router.get("/person/feed",checkLogin, async (req, res) => {
    
    try{
        const data = await Post.find({"followerId.userId":req.userId});
        res.status(200).json({
            feedObject: data,
          });
        }
    catch(err){
        res.status(500).json({
            error: "There was a server side error!",
          });
    }
  });

  module.exports = router;