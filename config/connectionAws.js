const { S3Client } = require('@aws-sdk/client-s3')
require('dotenv').config()

const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY

exports.s3 = new S3Client({
	credentials: {
		accessKeyId: accessKey,
		secretAccessKey: secretAccessKey,
	},
	region: bucketRegion
})

exports.putOption = (key, body, type) => {
	let result = {
		Bucket: bucketName,
		Key: key,
		Body: body,
		ContentType: type
	}
	return result
}

exports.deleteOption = (key) => {
	let result = {
		Bucket: bucketName,
        Key: key
	}
	return result
}