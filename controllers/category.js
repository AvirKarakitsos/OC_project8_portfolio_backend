const Category = require('../models/Category')

//Get all categories
exports.getAllCategorys = (req, res, next) => {
    Category.find()
    .then(categories => res.status(200).json(categories))
    .catch(error => res.status(400).json({ error }))
}

//Post a category
exports.createCategory = async (req,res,next) => {
    let newCategory = {...req.body}
    let word = newCategory.english
    let key = word.split(" ").join("")
    delete newCategory.userId

    let category = new Category({
        userId: req.auth.userId,
        key: key.toLowerCase(),
        ...newCategory
    })
    category.save()
    .then(() => res.status(201).json({ message: 'Catégorie enregistrée'}))
    .catch(error => res.status(400).json({ error }))
}

//Modify a category
exports.updateCategory = async (req, res, next) => {
    let newCategory = {...req.body}
    let word = newCategory.english
    let key = word.split(" ").join("")

    delete newCategory.userId

    Category.findOne({_id: req.params.id})
    .then(category => {
        if (category.userId !== req.auth.userId) {
            res.status(403).json({ message : 'unauthorized request'})
        } else {
            Category.updateOne({_id: req.params.id},
                {
                    ...newCategory,
                    key: key.toLowerCase(),
                    userId: req.auth.userId,
                    _id: req.params.id,
                }
            )
            .then(() => res.status(201).json({ message: 'Catégorie modifiée'}))
            .catch(error => res.status(400).json({ error }))
        }
    })
    .catch(error => res.status(400).json({ error }))
}

//Delete one category
exports.deleteCategory = (req, res, next) => {
    Category.findOne({ _id: req.params.id})
    .then(category => {
        if (category.userId !== req.auth.userId) {
            res.status(403).json({message: 'unauthorized request'})
        } else {
            Category.deleteOne({_id: req.params.id})
            .then(() => { res.status(200).json({message: 'Catégorie supprimée'})})
            .catch(error => res.status(401).json({ error }))
        }
    })
    .catch( error => res.status(500).json({ error }))
    
 }