const express = require('express')
const contentController = require('../controllers/content');
const auth = require('../middlewares/auth');
const router = express.Router();

router.get('/',contentController.getAllContents);

router.post('/',auth,contentController.createContent);

router.put('/:id',auth,contentController.updateContent);

router.delete('/:id',auth,contentController.deleteContent);

module.exports = router;