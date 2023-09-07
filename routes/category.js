const express = require('express')
const categoryController = require('../controllers/category')
const auth = require('../middlewares/auth')

const router = express.Router()

router.get('/', categoryController.getAllCategorys)

router.post('/', auth, categoryController.createCategory)

router.put('/:id', auth, categoryController.updateCategory)

router.delete('/:id', auth, categoryController.deleteCategory)

module.exports = router