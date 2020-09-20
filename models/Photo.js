const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const PhotoSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Untitled',
  },
  fileUri: {
    type: String,
  },
  tags: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

// Delete file before deleting photo from DB
PhotoSchema.pre('remove', function (next) {
  let filename = this.fileUri.split('/');
  filename = filename[filename.length - 1];
  filename = path.join(path.parse(__dirname).dir, 'public', 'photos', filename);
  fs.unlink(filename, () => {
    return next();
  });
});

module.exports = mongoose.model('Photo', PhotoSchema);
