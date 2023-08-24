const multer = require('multer');
const storage = multer.memoryStorage();

//Store in memory the image
module.exports = multer({storage: storage}).single('image');