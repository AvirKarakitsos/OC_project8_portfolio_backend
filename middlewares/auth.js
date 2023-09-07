const jwt = require('jsonwebtoken')
 
//Decode the token comming from the frontend
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1] //["bearer","token"]
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET')
       const userId = decodedToken.userId
       req.auth = {
           userId: userId
       }
	next()
   } catch(error) {
       res.status(401).json({ error })
   }
}