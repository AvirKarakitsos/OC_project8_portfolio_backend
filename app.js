const express = require('express')
const projectRoutes = require('./routes/project')
const userRoutes = require('./routes/user')
const skillRoutes = require('./routes/skill')
const videoRoutes = require('./routes/video')
const contentRoutes = require('./routes/content')
const categoryRoute = require('./routes/category')
const helmet = require('helmet')
const fs = require('fs').promises
require('dotenv').config()


//const permission = 'http://localhost:3000'
const permission = 'https://arnocotsoyannis-portfolio.onrender.com'

const path = require('path')

const app = express()

//Intercept request with a json content-type
app.use(express.json())

//Protect headers of requests
app.set('trust proxy', true)
app.disable('x-powered-by')
app.use(helmet(
    {
        crossOriginResourcePolicy: {policy: "cross-origin"}
    }
))

//CORS configuration
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', permission)
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next()
})

//Define routes
app.use('/api/contents', contentRoutes)
app.use('/api/skills', skillRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/categories/', categoryRoute)
app.use('/api/videos', videoRoutes)
app.use('/api/auth', userRoutes)

app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/videos', express.static(path.join(__dirname, 'videos')))

module.exports = app