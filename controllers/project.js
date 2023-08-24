const Project = require('../models/Project');
const fs = require('fs');
const sharp = require('sharp');

//Get all projects
exports.getAllProjects = (req, res, next) => {
    Project.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
}

//Get one project by its id
exports.getOneProject = (req, res, next) => {
    Project.findOne({_id: req.params.id})
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
}

//Post a project
exports.createProject = async (req,res,next) => {
    try {
        let projectObject = JSON.parse(req.body.project);
        let name = req.file.originalname.split(' ').join('_'); //Construct a new name for the image
        let nameComplete = Date.now() + name;                  //with a unique name
        let image = sharp(req.file.buffer)
    
        //Stock image and image resize with a width of 450px
        await image.toFile(`./images/${nameComplete}`)
        await image.resize(450,null).toFile(`./images/small/${nameComplete}`)
    
        //Create a new project
        let project = new Project({
            ...projectObject,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${nameComplete}`
        });
        project.save()
        .then(() => res.status(201).json({ message: 'Projet enregistré !'}))
        .catch(error => res.status(400).json({ error }));
    } catch(error) {
        console.log(error.message)
    }
}

//Modify a project
exports.updateProject = async (req, res, next) => {
}

//Delete one project
exports.deleteProject = (req, res, next) => {
    Project.findOne({ _id: req.params.id})
    .then(book => {
        if (book.userId != req.auth.userId) {
            res.status(403).json({message: 'unauthorized request'});
        } else {
            let filename = book.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Project.deleteOne({_id: req.params.id})
                .then(() => { res.status(200).json({message: 'Livre supprimé !'})})
                .catch(error => res.status(401).json({ error }));
            });
        }
    })
    .catch( error => res.status(500).json({ error }));
 };