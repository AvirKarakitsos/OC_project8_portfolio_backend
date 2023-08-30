const multer = require('multer');

const storage = multer.memoryStorage();

//Store in memory the image
//module.exports = multer({storage: storage}).single('image');


// module.exports = multer({storage: storage}).fields([{
//        name: 'image', maxCount: 1
//        }, {
//        name: 'video', maxCount: 1
//        }]);

const videoStorage = multer.diskStorage({
	
	destination: (req, file, callback) => {
		console.log(file)
		callback(null, 'videos');
	},
	filename: (req, file, callback) => {
		let videoName = file.originalname.split(' ').join('_'); //Construct a new name for the video
        let completeNameVideo = Date.now() + videoName;
		callback(null, completeNameVideo);
	}
});
module.exports = {
	imageUpload: multer({storage: videoStorage}).fields([{
		name: 'image', maxCount: 1
	}, {
		name: 'video', maxCount: 1
	}]),
	//videoUpload: multer({ storage: videoStorage }).single('video'),
};
