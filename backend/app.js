const express = require('express');

const app = express();



app.use('/api/posts' , (req, res, next) => {
  const posts = [
    {
    id: 'fdfk33',
    title: "first server post",
    content: "this my first vconter"
    },
    {
      id: 'fdfk33',
      title: "second server post",
      content: "this my first vconter"
    }
  ]


  res.status(200).json({
    message: 'post sent succefly',
    posts: posts
  })
});

module.exports = app;
