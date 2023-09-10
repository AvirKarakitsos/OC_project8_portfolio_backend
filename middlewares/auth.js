const jwt = require('jsonwebtoken')
const fs= require('fs')
 
//Decode the token comming from the frontend
module.exports = (req, res, next) => {
   try {
        let secret = fs.readFileSync('./two.pem') 
        const token = req.headers.authorization.split(' ')[1] //["bearer","token"]
        const decodedToken = jwt.verify(token, secret)
        const userId = decodedToken.userId
        req.auth = {
            userId: userId
        }
	next()
   } catch(error) {
       res.status(401).json({ error })
   }
}