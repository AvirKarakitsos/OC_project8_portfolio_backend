const { S3Client } = require('@aws-sdk/client-s3')
require('dotenv').config()


const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY

module.exports = new S3Client({
	credentials: {
		accessKeyId: accessKey,
		secretAccessKey: secretAccessKey,
	},
	region: bucketRegion
})