const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post')

const app = express();

mongoose.connect('mongodb+srv://meryemsekk:MxsrRivZ3m45mAd9@cluster0.gkt67j4.mongodb.net/fullstack=true&w=majority')
  .then(( ) => {
    console.log("connected")
  })
  .catch(() => {
    console.log("connection failed")
  })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

//if ports are diffrent
app.use((red, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Headers', '*')
  res.setHeader('Access-Control-Allow-Methods', "*");
  next();
})


const posts = []

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save();

  res.status(201).json({
    message: 'Post added successfully',
    posts: posts
  });
});

app.get('/api/posts' , (req, res, next) => {
  Post.find()
    .then(documents => {
      res.status(200).json({
        message: 'post fetched successfly',
        posts: documents
      })
    })
    .catch();
});

module.exports = app;
