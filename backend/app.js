const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const  postsRoutes = require('./route/posts');
const userRoutes = require('./route/user')


const path = require('path')
const app = express();

mongoose.connect('mongodb+srv://meryemsekk:'+process.env.MONGO_ATLAS_PW+'@cluster0.gkt67j4.mongodb.net/fullstack=true&w=majority')
  .then(( ) => {
    console.log("connected")
  })
  .catch(() => {
    console.log("connection failed")
  })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use("/images", express.static(path.join("backend/images")));

//if ports are diffrent
app.use((red, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Headers', '*')
  res.setHeader('Access-Control-Allow-Methods', "*");
  next();
})

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);


module.exports = app;
