const multer = require('multer');

const imageStorage = multer.memoryStorage()

const videoStorage = multer.diskStorage({	
	destination: (req, file, callback) => {
		if (file.mimetype === "video/mp4") {
			callback(null, 'videos');
		} else {
			callback(null, 'images');
		}
	},
	filename: (req, file, callback) => {
		let name = file.originalname.split(' ').join('_'); //Construct a new name for the file
        let completeName = Date.now() + name;
		callback(null, completeName);
	}
});

module.exports = {
	imageUpload: multer({storage: imageStorage}).single("image"),
	videoUpload: multer({storage: videoStorage}).single('video')
} 