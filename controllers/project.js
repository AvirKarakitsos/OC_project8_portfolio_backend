const Project = require('../models/Project')
const Category = require('../models/Category')
const Video = require('../models/Video')
const sharp = require('sharp')
const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3')
const { s3, putOption, deleteOption} = require('../config/connectionAws')

//Get all projects
exports.getAllProjects =  async (req, res, next) => {
    Project.find()
    .then((projects) => res.status(200).json(projects) )    
    .catch(error => res.status(500).json({error}))
}

//Get one project by its id
exports.getOneProject = (req, res, next) => {
    Project.findOne({_id: req.params.id})
    .then((project) => res.status(200).json(project) )
    .catch(error => res.status(404).json({ error }))
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
        .catch(error => res.status(404).json({ error }))
    })
    .catch(error => res.status(400).json({ error }))
}


// Get the video of a project
exports.getVideo = (req, res, next) => {
    Project.findOne({_id: req.params.id})
    .then(project => {
        Video.find()
        .then(videos => {
            let videoProject = videos.filter( video => video.projectId === project._id.toString() )
            res.status(200).json(videoProject)
        })
        .catch(error => res.status(404).json({ error }))
    })
    .catch(error => res.status(400).json({ error }))
}

//Post a project
exports.createProject = async (req,res,next) => {
    try {
        let projectObject = JSON.parse(req.body.project)
        let name = req.file.originalname.split(' ').join('_') //Construct a new name for the file
        let imageName = Date.now() + name
        let smallImageName = "small-"+imageName
        
        let image = sharp(req.file.buffer)
        let smallImage = await image.resize(315,null).toBuffer()

        delete projectObject.userId

        let params1 = putOption(imageName,req.file.buffer,req.file.mimetype)
        let params2 = putOption(smallImageName,smallImage,req.file.mimetype)

        let command1 = new PutObjectCommand(params1)
        let command2= new PutObjectCommand(params2)

        await s3.send(command1)
        await s3.send(command2)

        //Create a new project
        let project = new Project({
            ...projectObject,
            userId: req.auth.userId,
            imageUrl: `https://portfolio-ac-public.s3.eu-west-3.amazonaws.com/${imageName}`
        })
        project.save()
        .then(() => res.status(201).json({ message: 'Projet enregistré !'}))
        .catch(error => res.status(400).json({ error }))
    } catch(error) {
        console.log(error.message)
        res.status(400).json({ error })
    }
}

//Modify a project
exports.updateProject = async (req, res, next) => {
    let projectObject = null
    let newContent = null
    let project = await Project.findOne({_id: req.params.id})

    if(req.file) {
        let name = req.file.originalname.split(' ').join('_') //Construct a new name for the file
        let imageName = Date.now() + name
        let smallImageName = "small-"+imageName
        
        let image = sharp(req.file.buffer)
        let smallImage = await image.resize(315,null).toBuffer()

        let oldName = project.imageUrl.split('.com/')[1]

        projectObject = {
            ...JSON.parse(req.body.project),
            imageUrl: `https://portfolio-ac-public.s3.eu-west-3.amazonaws.com/${imageName}`
        }
        newContent = {
            language: projectObject.content[0].language,
            text: projectObject.content[0].text
        }
        let bucketName = process.env.BUCKET_NAME

        let params1 = putOption(imageName,req.file.buffer,req.file.mimetype)
        let params2 = putOption(smallImageName,smallImage,req.file.mimetype)

        let command1 = new PutObjectCommand(params1)
        let command2= new PutObjectCommand(params2)

        let delete1 = new DeleteObjectCommand(deleteOption(oldName))
        let delete2 = new DeleteObjectCommand(deleteOption(`small-${oldName}`))

        await s3.send(command1)
        await s3.send(command2)
        await s3.send(delete1)
        await s3.send(delete2)
    } else {
        projectObject = { ...req.body }
        newContent = {
            language: req.body.content[0].language,
            text: req.body.content[0].text
        }
    }

    delete projectObject.content
    delete projectObject.userId
     
    if (project.userId !== req.auth.userId) {
        res.status(403).json({ message : 'unauthorized request'})
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
                .catch(error => res.status(400).json({ error }))
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
                .catch(error => res.status(400).json({ error }))
        }
    }
}

//Delete one project
exports.deleteProject = async (req, res, next) => {
    try {
    
        let project = await Project.findOne({ _id: req.params.id})
    
        if (project.userId !== req.auth.userId) {
            res.status(403).json({message: 'unauthorized request'})
        } else {
            let filename = project.imageUrl.split('.com/')[1]
            let delete1 = new DeleteObjectCommand(deleteOption(filename))
            let delete2 = new DeleteObjectCommand(deleteOption(`small-${filename}`))
           
            await s3.send(delete1)
            await s3.send(delete2)
                
            Project.deleteOne({_id: req.params.id})
                .then(() => res.status(200).json({message: 'Projet supprimé'}))
                .catch(error => res.status(400).json({ error }))
        }
    } catch(error) {
        console.log(error)
        res.status(500).json({ error })
    }
 }