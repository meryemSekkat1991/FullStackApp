const Post = require("../models/post");
exports.createPost = (req, res, next) => {
  // constrat url to server
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });
  console.log(req.userData)
  //return res.status(200).json()
  post.save()
    .then(createdPost => {
      res.status(201).json({
        message: "Post added successfully",
        post: {
          ...createdPost,
          id: createdPost._id
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "creating post failed"
      })
    })
}

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if(post) {
      res.status(200).json(post)
    } else {
      res.status(404).json({ message: 'post not found'});
    }
  })
    .catch(error => {
      res.status(500).json({
        message: "fetching post posts"
      })
    })
}

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "fetching post posts"
      })
    })
  ;
}


exports.updatePost =  (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename
  }
  const post = new Post({
    _id: req.body._id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  console.log(req.userData);
  console.log(post)
  Post.updateOne({ _id: req.params.id , creator: req.userData.userId}, post)
    .then(result => {
      console.log(result)
      if(result.matchedCount > 0) {
        res.status(200).json({ message: "Update successful!" });
      }
      res.status(401).json({ message: "not authorized!" });
  })
  .catch(error => {
    res.status(500).json({
      message: "Updating post failed"
    })
  });
}

exports.deletePost = (req, res, next) => {
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
    console.log(result);
    if(result.deletedCount > 0) {
      res.status(200).json({
        message: "post deleted"
      })
    } else {
      res.status(401).json({
        message: "Not authorized"
      })
    }
  })
    .catch(error => {
      res.status(500).json({
        message: "deleting post failed"
      })
    })
}
