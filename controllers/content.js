const Content = require('../models/Content')

//Get all contents
exports.getAllContents = (req, res, next) => {
    Content.find()
    .then(contents => res.status(200).json(contents))
    .catch(error => res.status(400).json({ error }))
}

//Post a content
exports.createContent = async (req,res,next) => {
    let newContent = {...req.body}

    delete newContent.userId

    let content = new Content({
        userId: req.auth.userId,
        ...newContent
    })
    content.save()
    .then(() => res.status(201).json({ message: 'Contenu enregistré'}))
    .catch(error => res.status(400).json({ error }))
}

//Modify a content
exports.updateContent = async (req, res, next) => {
    let newContent = {...req.body}
   
    delete newContent.userId

    Content.findOne({_id: req.params.id})
    .then(content => {
        if (content.userId !== req.auth.userId) {
            res.status(403).json({ message : 'unauthorized request'})
        } else {
            Content.updateOne({_id: req.params.id},
                {
                    ...newContent,
                    userId: req.auth.userId,
                    _id: req.params.id,
                }
            )
            .then(() => res.status(201).json({ message: 'Contenu modifié'}))
            .catch(error => res.status(400).json({ error }))
        }
    })
    .catch(error => res.status(400).json({ error }))
}

//Delete one content
exports.deleteContent = (req, res, next) => {
    Content.findOne({ _id: req.params.id})
    .then(content => {
        if (content.userId !== req.auth.userId) {
            res.status(403).json({message: 'unauthorized request'})
        } else {
            Content.deleteOne({_id: req.params.id})
            .then(() => { res.status(200).json({message: 'Contenu supprimé'})})
            .catch(error => res.status(401).json({ error }))
        }
    })
    .catch( error => res.status(500).json({ error }))
    
 }