const rateLimit = require("express-rate-limit")

const limiter = rateLimit({
    max: 3,
    windowMs: 60*1000,
    standardHeaders: false, // default value
    legacyHeaders: false // default value
})

module.exports = limiter