const express = require('express');
const FriendsService = require('./friends-service');
const { requireAuth } = require('../middleware/jwt-auth');

const friendsRouter = express.Router();

friendsRouter.route('/').get((req, res, next) => {});
