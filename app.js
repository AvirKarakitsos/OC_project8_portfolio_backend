const express = require('express');
const projectRoutes = require('./routes/project');
const userRoutes = require('./routes/user');
const skillRoutes = require('./routes/skill');
const videoRoutes = require('./routes/video')

const path = require('path');
require('dotenv').config();

const app = express();

//Intercept request with a json content-type
app.use(express.json());

//Solve CORS problems
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//Define routes
app.use('/api/videos',videoRoutes);
app.use('/api/skills',skillRoutes);
app.use('/api/projects',projectRoutes);
app.use('/api/auth',userRoutes);

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/videos', express.static(path.join(__dirname, 'videos')));

module.exports = app;