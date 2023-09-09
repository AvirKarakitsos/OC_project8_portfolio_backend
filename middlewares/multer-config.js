const multer = require('multer')
const { S3Client } = require('@aws-sdk/client-s3')
const multerS3 = require('multer-s3')
require('dotenv').config()


const imageStorage = multer.memoryStorage()


const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY

const s3 = new S3Client({
	credentials: {
		accessKeyId: accessKey,
		secretAccessKey: secretAccessKey,
	},
	region: bucketRegion
})

const videoStorage = multer({
	storage: multerS3({
	  s3: s3,
	  bucket: bucketName,
	  contentType: multerS3.AUTO_CONTENT_TYPE,
	  key: (req, file, cb) => {
		let name = file.originalname.split(' ').join('_') //Construct a new name for the file
        let completeName = Date.now() + name
		cb(null, Date.now().toString() + completeName)
	  }
	})
})

module.exports = {
	imageUpload: multer({storage: imageStorage}).single("image"),
	videoUpload: videoStorage.single('video')
} 