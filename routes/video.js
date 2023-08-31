const express = require('express')
const videoController = require('../controllers/video');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config')
const router = express.Router();

router.get('/',videoController.getAllVideos);

router.post('/',auth,multer.videoUpload,videoController.createVideo);

router.put('/:id',auth,multer.videoUpload,videoController.updateVideo);

router.delete('/:id',auth,videoController.deleteVideo);

module.exports = router;