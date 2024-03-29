const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const userSchema = require("../schemas/userSchema");
const User = new mongoose.model("User", userSchema);

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
                    "error": "Authentication failed!"
                });
            }
        } else {
            res.status(401).json({
                "error": "Authentication failed!"
            });
        }
    } catch {
        res.status(401).json({
            "error": "Authentication failed! problem in main block"
        });
    }
});

module.exports = router;
