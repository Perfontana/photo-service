const express = require('express');
const multer = require('multer');

// Multer file filter
const fileFilter = function (req, file, cb) {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Multer storage options
const storage = multer.memoryStorage();

var upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10Mb limit
});

const {
  getPhotos,
  getPhoto,
  createPhoto,
  updatePhoto,
  deletePhoto,
} = require('../controllers/photos');

const { protect } = require('../middleware/auth');

const Photo = require('../models/Photo');
const queryMaker = require('../middleware/queryMaker');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(queryMaker(Photo, 'user'), getPhotos)
  .post(protect, upload.single('photo'), createPhoto);

router
  .route('/:id')
  .get(getPhoto)
  .put(protect, updatePhoto)
  .delete(protect, deletePhoto);

module.exports = router;
