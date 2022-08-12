const express = require('express');
const multer = require('multer');

const postController = require('../controllers/post');
const checkoff = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

const router = express.Router();

router.post(
  "",
  checkoff,
   extractFile ,postController.createPost );


router.get('/:id', postController.getPost);

router.get("", postController.getPosts);

router.put(
  "/:id",
  checkoff,
  extractFile, postController.updatePost
);


router.delete('/:id', checkoff, postController.deletePost);


module.exports = router;

