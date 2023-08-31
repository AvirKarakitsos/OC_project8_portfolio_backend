const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
	userId: { type: String, required: true },
	title: { type: String, required: true },
	imageUrl: { type: String, required: true },
	tags: { type: String, required: true },
	content: [{  _id: false, language: String, text: String }],
	link: { type: String, required: true },
	type: { type: String, required: true }
},
{ timestamps: true });

module.exports = mongoose.model('Project', projectSchema);