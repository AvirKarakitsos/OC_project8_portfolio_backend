const multer = require('multer');

const imageStorage = multer.memoryStorage()

const videoStorage = multer.diskStorage({	
	destination: (req, file, callback) => {	
		callback(null, 'videos');
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