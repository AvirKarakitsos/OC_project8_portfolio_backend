const Skill = require('../models/Skill')

//Get all skills
exports.getAllSkills = (req, res, next) => {
    Skill.find()
    .then(skills => res.status(200).json(skills))
    .catch(error => res.status(400).json({ error }));
}

//Post a skill
exports.createSkill = async (req,res,next) => {
    let newSkill = {...req.body}

    delete newSkill.userId

    let skill = new Skill({
        userId: req.auth.userId,
        ...newSkill
    })
    skill.save()
    .then(() => res.status(201).json({ message: 'Compétence enregistré !'}))
    .catch(error => res.status(400).json({ error }));
}

//Modify a skill
exports.updateSkill = async (req, res, next) => {
    let newSkill = {...req.body}

    delete newSkill.userId

    Skill.findOne({_id: req.params.id})
    .then(skill => {
        if (skill.userId !== req.auth.userId) {
            res.status(403).json({ message : 'unauthorized request'});
        } else {
            Skill.updateOne({_id: req.params.id},
                {
                    ...newSkill,
                    userId: req.auth.userId,
                    id: req.params.id,
                }
            )
            .then(() => res.status(201).json({ message: 'Compétence enregistré !'}))
            .catch(error => res.status(400).json({ error }));
        }
    })
    .catch(error => res.status(400).json({ error }));
}

//Delete one skill
exports.deleteSkill = (req, res, next) => {
    Skill.findOne({ _id: req.params.id})
    .then(skill => {
        if (skill.userId !== req.auth.userId) {
            res.status(403).json({message: 'unauthorized request'});
        } else {
            Project.deleteOne({_id: req.params.id})
            .then(() => { res.status(200).json({message: 'Compétence supprimé !'})})
            .catch(error => res.status(401).json({ error }));
        }
    })
    .catch( error => res.status(500).json({ error }));
    
 };