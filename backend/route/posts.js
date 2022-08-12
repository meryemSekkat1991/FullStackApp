const express = require('express');
const multer = require('multer');

const postController = require('../controllers/post')
const checkoff = require('../middleware/check-auth')


const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

router.post(
  "",
  checkoff,
  multer({ storage: storage }).single("image"), postController.createPost );


router.get('/:id', postController.getPost);

router.get("", postController.getPosts);

router.put(
  "/:id",
  checkoff,
  multer({ storage: storage }).single("image"), postController.updatePost
);


router.delete('/:id', checkoff, postController.deletePost);


module.exports = router;

