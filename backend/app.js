const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

//if ports are diffrent
app.use((red, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Headers', 'Origin X-Requested-With content-type, Accept')
  res.setHeader('Access-Control-Allow-Methods', "GET, POST,PATCH, DELETE, OPTION");
  next();
})


app.post("/api/posts", (req, res, next) => {
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: 'Post added successfully'
  });
});

app.get('/api/posts' , (req, res, next) => {
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
