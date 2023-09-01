const express = require('express')
const projectController = require('../controllers/project');
const multer = require('../middlewares/multer-config');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/',projectController.getAllProjects);
router.get('/:id',auth,projectController.getOneProject);
router.get('/:id/color',auth,projectController.getColor);

router.post('/',auth,multer.imageUpload,projectController.createProject);

router.put('/:id',auth,multer.imageUpload,projectController.updateProject);

router.delete('/:id',auth,projectController.deleteProject);

module.exports = router;
