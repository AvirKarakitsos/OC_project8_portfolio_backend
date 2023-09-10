const multer = require('multer')
const multerS3 = require('multer-s3')
const {s3} = require('../config/connectionAws')
require('dotenv').config()


const imageStorage = multer.memoryStorage()

const videoStorage = multer({
	storage: multerS3({
	  s3: s3,
	  bucket: process.env.BUCKET_NAME,
	  contentType: multerS3.AUTO_CONTENT_TYPE,
	  key: (req, file, cb) => {
		let name = file.originalname.split(' ').join('_') //Construct a new name for the file
        let completeName = Date.now() + name
		cb(null, completeName)
	  }
	})
})

module.exports = {
	imageUpload: multer({storage: imageStorage}).single("image"),
	videoUpload: videoStorage.single('video')
} 