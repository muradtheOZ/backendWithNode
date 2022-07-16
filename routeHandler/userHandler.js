const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const userSchema = require("../schemas/userSchema");
const User = new mongoose.model("User", userSchema);
const pageSchema = require("../schemas/pageSchema");
const Page = new mongoose.model("Page", pageSchema);
const postSchema = require("../schemas/postSchema");
const Post = new mongoose.model("Post", postSchema);
const checkLogin = require("../middlewares/checkLogin");

// SIGNUP
router.post("/auth/register", async(req, res) => {
    try {
        
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
        });
        await newUser.save();
        res.send(newUser);
    } catch {
        res.status(500).json({
            message: "Signup failed!",
        });
    }
});

// LOGIN
router.post("/auth/login", async(req, res) => {
    try {
        const user = await User.find({ email: req.body.email });
        if(user && user.length > 0) {
            const isValidPassword = await bcrypt.compare(req.body.password, user[0].password);

            if(isValidPassword) {
                // generate token
                const token = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id,
                }, process.env.JWT_SECRET, {
                    expiresIn: '2d'
                });

                res.status(200).json({
                    "Bearer authorization token": token,
                    "user Object": user[0],
                });
            } else {
                res.status(401).json({
                    "error": "Authetication failed!"
                });
            }
        } else {
            res.status(401).json({
                "error": "Authetication failed!"
            });
        }
    } catch {
        res.status(401).json({
            "error": "Authetication failed! problem in main block"
        });
    }
});

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
