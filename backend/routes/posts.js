const express = require("express");
const Post = require("../models/post");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

//Create post
router.post("", checkAuth, (req, res, next) => {
    const post = new Post({
        name: req.body.name,
        weight: req.body.weight,
        amount: req.body.amount,
        price: req.body.price,
        creator: req.userData.userId
    });
    //console.log(req.body.name)
    post.save()
        .then((createdPost) => {
            res.status(201).json({
                message: "Post added successfully",
                post: {
                    id: createdPost._id,
                    name: createdPost.name,
                    weight: createdPost.weight,
                    amount: createdPost.amount,
                    price: createdPost.price,
                    creator: createdPost.creator
                }
            });
        })
        .catch((error) => {
          //console.log(error)
            // res.status(500).json({
            //     message: "Couldn't create the post for some reason"
            // });
        });
});

//upload post
router.put("/:id", checkAuth, (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + "://" + req.get("host");
        imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
        _id: req.body.id,
        name: req.body.name,
        weight: req.body.weight,
        amount: req.body.amount,
        price: req.body.price,
        creator: req.userData.userId
    });
    //Edit post
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
        .then((result) => {
            if (result.modifiedCount > 0)
                res.status(200).json({ message: "Updated successfully! :D" });
            else res.status(401).json({ message: "This isn't yours to edit" });
        })
        .catch((error) => {
            res.status(500).json({ message: "Couldn't update....  why?" });
        });
});

//read posts
router.get("", (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if (pageSize && currentPage) {
        postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    postQuery
        .then((documents) => {
            fetchedPosts = documents;
            return Post.count();
        })
        .then((count) => {
            res.status(200).json({
                message: "Posts fetched successfully",
                posts: fetchedPosts,
                maxPosts: count
            });
        });
});

//read one post
router.get("/:id", (req, res, next) => {
    Post.findById(req.params.id).then((post) => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: "Post not found!" });
        }
    });
});

//Deleting post
router.delete("/:id", checkAuth, (req, res, next) => {
    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(
        (result) => {
            if (result.deletedCount > 0)
                res.status(200).json({ message: "Deleted successfully!" });
            else
                res.status(401).json({ message: "This isn't yours to delete" });
        }
    );
});

module.exports = router;
