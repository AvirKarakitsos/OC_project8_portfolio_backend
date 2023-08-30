const Project = require('../models/Project');
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

//Post a project
exports.createProject = async (req,res,next) => {
    try {
        console.log("post controller")
        // let projectObject = JSON.parse(req.body.project);
        // let imageName = req.file.image[0].originalname.split(' ').join('_'); //Construct a new name for the image
        // let videoName = req.file.video[0].originalname.split(' ').join('_'); //Construct a new name for the video
        // let completeNameImage = Date.now() + imageName;                  //with a unique name
        // let completeNameVideo = Date.now() + videoName;

        // let image = sharp(req.files.image[0].buffer);
        // //let video = sharp(req.files.video[0].buffer);

        // delete projectObject.userId;

        // //Stock image, image resized with a width of 450px and video
        // await image.toFile(`./images/${completeNameImage}`)
        // await image.resize(450,null).toFile(`./images/small/${completeNameImage}`)
        // //await video.toFile(`./videos/${completeNameVideo}`)
    
        // //Create a new project
        // let project = new Project({
        //     ...projectObject,
        //     userId: req.auth.userId,
        //     videoUrl: `${req.protocol}://${req.get('host')}/videos/${completeNameImage}`,
        //     imageUrl: `${req.protocol}://${req.get('host')}/images/${completeNameVideo}`
        // });
        // project.save()
        //.then(() => res.status(201).json({ message: 'Projet enregistré !'}))
        //.catch(error => res.status(400).json({ error }));
    } catch(error) {
        console.log(error.message)
    }
}

//Modify a project
exports.updateProject = async (req, res, next) => {
    let projectObject = { ...req.body }
    let newContent = {
        language: req.body.content[0].language,
        text: req.body.content[0].text
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
                            id: req.params.id,
                            $set: {
                                'content.$.text' : newContent.text
                            }
                        },
                        )
                        .then(() =>  res.status(201).json({ message: 'Projet modifié !'}))
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
                        .then(() =>  res.status(201).json({ message: 'Projet modifié !'}))
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
                    .then(() => { res.status(200).json({message: 'Projet supprimé !'})})
                    .catch(error => res.status(401).json({ error }));
                })
            })
        }
    })
    .catch( error => res.status(500).json({ error }));
 };