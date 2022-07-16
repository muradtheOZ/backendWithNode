const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const pageSchema = require("../schemas/pageSchema");
const Page = new mongoose.model("Page", pageSchema);
const checkLogin = require("../middlewares/checkLogin");

//create a page
router.post("/page/create",checkLogin, (req, res) => {
    const newPage = new Page({
      "name":req.body.name,
      "userId":req.userId
    });
    newPage.save((err) => {
      if (err) {
        res.status(500).json({
          error: "There was a server side error!",
        });
      } else {
        res.status(200).json({
          message: "Page was created successfully",
        });
      }
    });
  });
  module.exports = router;