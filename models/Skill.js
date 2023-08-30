const mongoose = require('mongoose');

const skillSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  edit: { type: Boolean, default: false}
});

module.exports = mongoose.model('Skill', skillSchema);