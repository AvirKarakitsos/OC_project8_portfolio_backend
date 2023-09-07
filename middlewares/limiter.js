const rateLimit = require("express-rate-limit")

exports.limiter = rateLimit({
    max: 3,
    windowsMS: 60*1000,
    standardHeaders: false,
    legacyHeaders: false
})