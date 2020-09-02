const express = require('express');
const FriendsService = require('./friends-service');
const { requireAuth } = require('../middleware/jwt-auth');

const friendsRouter = express.Router();
const jsonBodyParser = express.json();

friendsRouter.route('/').get(requireAuth, (req, res, next) => {
  const user_id = req.user.id;
  FriendsService.getUserFriends(req.app.get('db'), user_id)
    .then((friends) => {
      res.json(FriendsService.serializeFriends(friends));
    })
    .catch(next);
});

friendsRouter
  .route('/:friend_id')
  .all(requireAuth)
  .all(checkFriendExists)
  .get((req, res) => {
    res.json(res.friend);
  });

friendsRouter
  .route('/:friend_id/likes')
  .all(requireAuth)
  .all(checkFriendExists)
  .get((req, res, next) => {
    FriendsService.getLikesForFriend(
      req.app.get('db'),
      req.params.friend_id,
      req.user.id
    )
      .then((likes) => {
        res.json(likes);
      })
      .catch(next);
  });

async function checkFriendExists(req, res, next) {
  try {
    const friend = await FriendsService.getById(
      req.app.get('db'),
      req.params.friend_id,
      req.user.id
    );

    if (!friend)
      return res.status(404).json({
        error: `Friend doesn't exist`,
      });

    res.friend = friend;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = friendsRouter;
