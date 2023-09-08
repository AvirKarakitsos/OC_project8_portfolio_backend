const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require("../models/User")
const fs = require('fs')

//Post to register a user
exports.signup = (req, res, next) => {
	bcrypt.hash(req.body.password, parseInt(process.env.BCRYPT_ROUND))
	.then(hash => {
		let user = new User({
			email: req.body.email,
			password: hash
		})
		console.log(user)
		user.save()
			.then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
			.catch(error => res.status(400).json({ error }))
	})
	.catch(error => res.status(500).json({ error }))
}

//Post to login a user
exports.login = (req, res, next) => {
	User.findOne({ email: req.body.email })
	.then(user => {
		if (!user) {
				return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'})
		}
		bcrypt.compare(req.body.password, user.password)
		.then(valid => {
				if (!valid) {
						return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' })
				}
				let secret = fs.readFileSync('./middlewares/folder/.certs/one.pem')
				res.status(200).json({
						userId: user._id,
						token: jwt.sign(
							{ userId: user._id },
							secret,
							{ expiresIn: process.env.JWT_DURING, algorithm: 'RS256' }
						)
				})
		})
		.catch(error => res.status(500).json({ error }))
	})
	.catch(error => res.status(500).json({ error }))
}