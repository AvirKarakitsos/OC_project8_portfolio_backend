const express = require('express')
const projectController = require('../controllers/project');
const multer = require('../middlewares/multer-config');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/',projectController.getAllProjects);
router.get('/:id',auth,projectController.getOneProject);

router.post('/',auth,multer,projectController.createProject);

router.put('/:id',auth,multer,projectController.updateProject);

router.delete('/:id',auth,projectController.deleteProject);

module.exports = router;
