const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
	title: { type: String, required: true },
	imageUrl: { type: String, required: true },
	tags: { type: String, required: true },
	content: { type: String, required: true },
	link: { type: String, required: true },
	language: { type: String, required: true },
	date:{ type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);