const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
  userId: { type: String, required: true },
  french: { type: String, required: true },
  english: { type: String, required: true },
  color: { type: String, required: true },
  key: { type: String, required: true },
  edit: { type: Boolean, default: false}
})

module.exports = mongoose.model('Category', categorySchema)