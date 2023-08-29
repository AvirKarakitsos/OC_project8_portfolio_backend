const express = require('express')
const skillController = require('../controllers/skill');

const router = express.Router();

router.get('/',skillController.getAllSkills);

router.post('/',auth,skillController.createSkill);

router.put('/:id',auth,skillController.updateSkill);

router.delete('/:id',auth,skillController.deleteSkill);

module.exports = router;
