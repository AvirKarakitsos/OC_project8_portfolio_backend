const mongoose = require('mongoose')

const contentSchema = mongoose.Schema({
  userId: { type: String, required: true },
  french: { type: String, required: true },
  english: { type: String, required: true },
  edit: { type: Boolean, default: false}
})

module.exports = mongoose.model('Content', contentSchema)