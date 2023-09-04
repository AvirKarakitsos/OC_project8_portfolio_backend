const Project = require('../models/Project');
const Category = require('../models/Category');
const Video = require('../models/Video');
const fs = require('fs');
const sharp = require('sharp');

//Get all projects
exports.getAllProjects = (req, res, next) => {
    Project.find()
    .then(projects => res.status(200).json(projects))
    .catch(error => res.status(400).json({ error }));
}

//Get one project by its id
exports.getOneProject = (req, res, next) => {
    Project.findOne({_id: req.params.id})
    .then(project => res.status(200).json(project))
    .catch(error => res.status(404).json({ error }));
}

//Get the color bookmark of a project
exports.getCategory = (req, res, next) => {
    Project.findOne({_id: req.params.id})
    .then(project => {
        Category.find() 
        .then(categories => {
            let colorProject = categories.filter( category => category.key === project.category)
            res.status(200).json(colorProject)
        })
        .catch(error => res.status(404).json({ error }));
    })
    .catch(error => res.status(400).json({ error }));
}

exports.getVideo = (req, res, next) => {
    Project.findOne({_id: req.params.id})
    .then(project => {
        Video.find()
        .then(videos => {
            let videoProject = videos.filter( video => video.projectId === project._id.toString() )
            res.status(200).json(videoProject)
        })
        .catch(error => res.status(404).json({ error }));
    })
    .catch(error => res.status(400).json({ error }));
}

//Post a project
exports.createProject = async (req,res,next) => {
    try {
        let projectObject = JSON.parse(req.body.project);
        let name = req.file.originalname.split(' ').join('_'); //Construct a new name for the file
        let completeName = Date.now() + name;
        let image = sharp(req.file.buffer)

        delete projectObject.userId;

        await image.toFile(`./images/${completeName}`)
        await image.resize(450,null).toFile(`./images/small/${completeName}`)

        //Create a new project
        let project = new Project({
            ...projectObject,
            userId: req.auth.userId,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${completeName}`
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
    let projectObject = null
    let newContent = null

    if(req.file) {
        let name = req.file.originalname.split(' ').join('_'); //Construct a new name for the file
        let completeName = Date.now() + name;
        let image = sharp(req.file.buffer)
        
        projectObject = {
            ...JSON.parse(req.body.project),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${completeName}`
        }
        newContent = {
            language: projectObject.content[0].language,
            text: projectObject.content[0].text
        }
        await image.toFile(`./images/${completeName}`)
        await image.resize(450,null).toFile(`./images/small/${completeName}`)
    } else {
        projectObject = { ...req.body }
        newContent = {
            language: req.body.content[0].language,
            text: req.body.content[0].text
        }
    }

    delete projectObject.content
    delete projectObject.userId;

    Project.findOne({_id: req.params.id})
        .then(project => {
            if (project.userId !== req.auth.userId) {
                res.status(403).json({ message : 'unauthorized request'});
            } else {
                if (project.content.some((input) => input.language === newContent.language)) {
                    Project.updateOne({_id: req.params.id, 'content.language': newContent.language},
                        {
                            ...projectObject,
                            userId: req.auth.userId,
                            _id: req.params.id,
                            $set: {
                                'content.$.text' : newContent.text
                            }
                        },
                        )
                        .then(() =>  res.status(201).json({ message: 'Projet modifié'}))
                        .catch(error => res.status(400).json({ error }));
                } else {
                    Project.updateOne({_id: req.params.id},
                        {
                            ...projectObject,
                            userId: req.auth.userId,
                            id: req.params.id,
                            $push: {
                                content: {language: newContent.language, text: newContent.text }
                            }
                        })
                        .then(() =>  res.status(201).json({ message: 'Projet modifié'}))
                        .catch(error => res.status(400).json({ error }));
                }
            }
        })
        .catch(error => res.status(400).json({ error }));
}

//Delete one project
exports.deleteProject = (req, res, next) => {
    Project.findOne({ _id: req.params.id})
    .then(project => {
        if (project.userId !== req.auth.userId) {
            res.status(403).json({message: 'unauthorized request'});
        } else {
            let filename = project.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                fs.unlink(`images/small/${filename}`, () => {
                    Project.deleteOne({_id: req.params.id})
                    .then(() => { res.status(200).json({message: 'Projet supprimé'})})
                    .catch(error => res.status(401).json({ error }));
                })
            })
        }
    })
    .catch( error => res.status(500).json({ error }));
 };