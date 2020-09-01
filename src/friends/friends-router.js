const express = require('express');
const FriendsService = require('./friends-service');
const { requireAuth } = require('../middleware/jwt-auth');

const friendsRouter = express.Router();
const jsonBodyParser = express.json();

friendsRouter.route('/').get(jsonBodyParser, (req, res, next) => {
  const { user_id } = req.body;
  FriendsService.getUserFriends(req.app.get('db'), user_id)
    .then((friends) => {
      res.status(200).json(FriendsService.serializeFriends(friends));
    })
    .catch(next);
});

friendsRouter.route('/:friends_id').get(jsonBodyParser, (req, res, next) => {});

module.exports = friendsRouter;
