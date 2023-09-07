const Video = require('../models/Video')
const fs = require('fs')

//Get all videos
exports.getAllVideos = (req, res, next) => {
    Video.find()
    .then(videos => res.status(200).json(videos))
    .catch(error => res.status(400).json({ error }))
}

//Post a video
exports.createVideo = async (req,res,next) => {
    let newVideo = JSON.parse(req.body.content)

    delete newVideo.userId

    let video = new Video({
        userId: req.auth.userId,
        videoUrl: `${req.protocol}://${req.get('host')}/videos/${req.file.filename}`,
        ...newVideo
    })
    video.save()
    .then(() => res.status(201).json({ message: 'Vidéo enregistrée'}))
    .catch(error => res.status(400).json({ error }))
}

//Modify a video
exports.updateVideo = async (req, res, next) => {
    let newVideo = JSON.parse(req.body.content)
    
    delete newVideo.userId

    Video.findOne({projectId: req.params.id})
    .then(video => {
        if (video.userId !== req.auth.userId) {
            res.status(403).json({ message : 'unauthorized request'})
        } else {
            let filename = video.videoUrl.split('/videos/')[1]
            fs.unlink(`videos/${filename}`, () => {
                Video.updateOne({projectId: req.params.id},
                    {
                        ...newVideo,
                        videoUrl:  `${req.protocol}://${req.get('host')}/videos/${req.file.filename}`,
                        userId: req.auth.userId,
                    }
                )
                .then(() => res.status(201).json({ message: 'Vidéo enregistrée'}))
                .catch(error => res.status(400).json({ error }))
            })
        }
    })
    .catch(error => res.status(400).json({ error }))
}

//Delete one video
exports.deleteVideo = (req, res, next) => {
    Video.findOne({ projectId: req.params.id})
    .then(video => {
        if (video.userId !== req.auth.userId) {
            res.status(403).json({message: 'unauthorized request'})
        } else {
            let filename = video.videoUrl.split('/videos/')[1]
            fs.unlink(`videos/${filename}`, () => {
                Video.deleteOne({projectId: req.params.id})
                .then(() => { res.status(200).json({message: 'Vidéo supprimée'})})
                .catch(error => res.status(401).json({ error }))
            })
        }
    })
    .catch( error => res.status(500).json({ error }))
 }