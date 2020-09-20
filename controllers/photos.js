const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const Photo = require('../models/Photo');

const path = require('path');
const fs = require('fs');

// @desc      Get photos
// @route     GET /api/v1/photos
// @route     GET /api/v1/users/:userId/photos
// @access    Public
module.exports.getPhotos = asyncHandler((req, res, next) => {
  if (req.params.userId) {
    const photos = Photo.find({ user: req.params.userId });

    return res.status(200).json({
      success: true,
      count: photos.length,
      data: photos,
    });
  } else {
    res.status(200).json(res.results);
  }
});

// @desc      Get single photo
// @route     GET /api/v1/photos/:id
// @access    Public
module.exports.getPhoto = asyncHandler((req, res, next) => {
  const photo = Photo.findById(req.params.id);

  if (!photo) {
    return next(
      new ErrorResponse(`Can't find a photo with id ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    data: res,
  });
});

// @desc      Create photo
// @route     POST /api/v1/photos
// @access    Private
module.exports.createPhoto = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(
      new ErrorResponse('File is not uploaded or file is not an image.', 400)
    );
  }

  req.body.user = req.user._id;

  const photo = await Photo.create(req.body);

  const filename = photo._id + '.' + req.file.mimetype.split('/')[1];

  fs.writeFile(
    path.join(path.parse(__dirname).dir, 'public', 'photos', filename),
    req.file.buffer,
    () => {
      photo.fileUri =
        req.protocol + '://' + req.get('host') + '/photos/' + filename;
      photo.save();

      res.status(200).json({
        success: true,
        data: photo,
      });
    }
  );
});

// @desc      Update photo
// @route     PUT /api/v1/photos/:id
// @access    Private
module.exports.updatePhoto = asyncHandler((req, res, next) => {
  const photo = Photo.findById(req.params.id);

  if (!photo) {
    return next(
      new ErrorResponse(`Can't find a photo with id ${req.params.id}`)
    );
  }

  photo.update(req.body);

  res.status(200).json({
    success: true,
    data: photo,
  });
});

// @desc      Delete photo
// @route     DELETE /api/v1/photos/:id
// @access    Private
module.exports.deletePhoto = asyncHandler(async (req, res, next) => {
  const photo = await Photo.findById(req.params.id);

  if (!photo) {
    return next(
      new ErrorResponse(`Can't find a photo with id ${req.params.id}`, 404)
    );
  }

  if (!photo.user.equals(req.user._id)) {
    return next(
      new ErrorResponse(`Unauthorized to delete a photo ${req.params.id}`, 401)
    );
  }

  photo.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
