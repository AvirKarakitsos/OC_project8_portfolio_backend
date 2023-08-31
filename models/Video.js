const mongoose = require('mongoose');

const videoSchema = mongoose.Schema({
  userId: { type: String, required: true },
  projectId: { type: String, required: true },
  videoUrl: { type: String, required: true },
});

module.exports = mongoose.model('Video', videoSchema);