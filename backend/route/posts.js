const express = require('express');
const multer = require('multer');
const Post = require("../models/post");


const router = express.Router();

const posts = []

const MINE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, cb ) => {
    const isValid = MINE_TYPE_MAP(file.minetype);
    let error = new Error("Invalid mine Type");
    if(isValid) {
      error = null
    }
    cb(null, "backend/images")
  },
  filename: (req, file, cb ) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MINE_TYPE_MAP(file.minetype);
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post("", multer(storage).single("image"), (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(result => {
    res.status(201).json({
      message: "posted",
      postId: result._id
    })
  }).catch(() => {});

  router.put("/:id", (req, res, next) => {
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content
    });
    Post.updateOne({ _id: req.params._id }, post).then(result => {
      res.status(200).json({ message: "Update successful!" });
    });
  })

  res.status(201).json({
    message: 'Post added successfully',
    posts: posts
  });
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if(post) {
      res.status(200).json(post)
    } else {
      res.status(404).json({ message: 'post not found'});
    }
  })
} )

router.get('' , (req, res, next) => {
  Post.find()
    .then(documents => {
      res.status(200).json({
        message: 'post fetched successfly',
        posts: documents
      })
    })
    .catch();
});

router.delete('/:id', (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then(result => {
    console.log(result)
  })
  res.status(200).json({
    message: "post deleted"
  })
});

module.exports = router;

