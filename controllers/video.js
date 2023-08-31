const Video = require('../models/Video')

//Get all videos
exports.getAllVideos = (req, res, next) => {
    Video.find()
    .then(videos => res.status(200).json(videos))
    .catch(error => res.status(400).json({ error }));
}

//Post a video
exports.createVideo = async (req,res,next) => {
    let newVideo = JSON.parse(req.body.content);

    delete newVideo.userId

    let video = new Video({
        userId: req.auth.userId,
        videoUrl: `${req.protocol}://${req.get('host')}/videos/${req.file.filename}`,
        ...newVideo
    })
    video.save()
    .then(() => res.status(201).json({ message: 'Vidéo enregistrée'}))
    .catch(error => res.status(400).json({ error }));
}

//Modify a video
exports.updateVideo = async (req, res, next) => {
    let newVideo = JSON.parse(req.body.content);
   
    delete newVideo.userId

    Video.findOne({_id: req.params.id})
    .then(video => {
        if (video.userId !== req.auth.userId) {
            res.status(403).json({ message : 'unauthorized request'});
        } else {
            Video.updateOne({_id: req.params.id},
                {
                    ...newVideo,
                    userId: req.auth.userId,
                    id: req.params.id,
                }
            )
            .then(() => res.status(201).json({ message: 'Vidéo enregistrée'}))
            .catch(error => res.status(400).json({ error }));
        }
    })
    .catch(error => res.status(400).json({ error }));
}

//Delete one video
exports.deleteVideo = (req, res, next) => {
    Video.findOne({ _id: req.params.id})
    .then(video => {
        if (video.userId !== req.auth.userId) {
            res.status(403).json({message: 'unauthorized request'});
        } else {
            Video.deleteOne({_id: req.params.id})
            .then(() => { res.status(200).json({message: 'Compétence supprimé !'})})
            .catch(error => res.status(401).json({ error }));
        }
    })
    .catch( error => res.status(500).json({ error }));
    
 };