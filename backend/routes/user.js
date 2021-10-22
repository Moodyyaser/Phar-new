const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const router = express.Router();

router.post("/signup", (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then((hash) => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
            .then((result) => {
                res.status(201).json({
                    message: "User created!",
                    result: result
                });
            })
            .catch((err) => {
                res.status(500).json({
                    message: "This email has already been taken."
                });
            });
    });
});

router.post("/login", (req, res, next) => {
    var _user;
    User.findOne({ email: req.body.email })
        .then((user) => {
            _user = user;
            if (!user) {
                return res.status(401).json({
                    message: "Auth failed!"
                });
            } //Return the comparing of this password and the original user's password
            const result = bcrypt.compareSync(req.body.password, user.password);

            if (!result) {
                return res.status(401).json({
                    message: "WRONG PASSWORD!!!!,... or email."
                });
            }
            const token = jwt.sign(
                //Sign the token in a secret key
                { email: _user.email, userId: _user._id },
                "4734b0be-0216-489c-b976-050906a711a0",
                { expiresIn: "1h" }
            );
            res.status(200).json({
                //Send the token
                token: token,
                expiresIn: 3600,
                userId: _user._id
            });
        })
        .catch((err) => {
            return res.status(401).json({
                message: "token damaged, create a new one."
            });
        });
});

module.exports = router;
