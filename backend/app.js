const express = require('express');

const app = express();

//if ports are diffrent
app.use((red, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Header', 'Origin X-Requested-With content-type, Accept')
  res.setHeader('Access-Control-Allow-Methods', "GET, POST,PATCH, DELETE, Option");
  next();
})

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
