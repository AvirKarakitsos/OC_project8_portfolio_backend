const multer = require('multer');

const videoStorage = multer.diskStorage({
	
	destination: (req, file, callback) => {
		//callback(null, 'videos');
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

module.exports = multer({storage: videoStorage}).fields(
	[{
       name: 'image', maxCount: 1
    }, 
	{
       name: 'video', maxCount: 1
    }]);