const express = require('express')
const auth = require('../middlewares/auth');
const router = express.Router();

router.get('/',videoController.getAllContents);

router.post('/',auth,multer.videoUpload,videoController.createContent);

router.put('/:id',auth,multer.videoUpload,videoController.updateContent);

router.delete('/:id',auth,videoController.deleteContent);

module.exports = router;