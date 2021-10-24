const express = require('express');
const Post = require('../models/post');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

//Create post
router.post('', checkAuth, (req, res, next) => {
  var post = new Post({
    name: req.body.name,
    date: req.body.date,
    index: req.body.te,

    companies: req.body.companies,

    element_ename: req.body.element_ename,
    element_eweight: req.body.element_eweight,
    element_eprice: req.body.element_eprice,

    element_name: req.body.element_name,
    element_weight: req.body.element_weight,
    element_amount: req.body.element_amount,
    element_price: req.body.element_price,
    creator: req.userData.userId,
  });
  post
    .save()
    .then((createdPost) => {
      res.status(201).json({
        message: 'Uploaded',
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Failed to upload',
      });
    });
});

//read posts
router.get('', (req, res, next) => {
  Post.find()
    .then((documents) => {
      console.log(req.query.index);
      var new_docs = documents.filter((user) => user.creator === req.query.creator);
      new_docs = new_docs.find((load) => load.index.toString() === req.query.index);
      my_post = new_docs;
      return Post.count();
    })
    .then((count) => {
      res.status(200).json({
        message: 'Got it!',
        posts: my_post,
      });
    });
});

//read one post
router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not found!' });
    }
  });
});

//Deleting post
router.delete('/:id', checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then((result) => {
    if (result.deletedCount > 0) res.status(200).json({ message: 'Deleted successfully!' });
    else res.status(401).json({ message: "This isn't yours to delete" });
  });
});

module.exports = router;
