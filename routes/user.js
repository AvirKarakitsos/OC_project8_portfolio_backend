const express = require('express');
const userController = require('../controllers/user');

const routes = express.Router();

routes.post('/signup',userController.signup);
routes.post('/login',userController.login);

module.exports = routes;

