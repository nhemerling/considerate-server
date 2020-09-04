const express = require('express');
const path = require('path');
const FriendsService = require('./friends-service');
const { requireAuth } = require('../middleware/jwt-auth');

const friendsRouter = express.Router();
const jsonBodyParser = express.json();

friendsRouter
  .route('/')
  .get(requireAuth, (req, res, next) => {
    const user_id = req.user.id;
    FriendsService.getUserFriends(req.app.get('db'), user_id)
      .then((friends) => {
        res.json(FriendsService.serializeFriends(friends));
      })
      .catch(next);
  })
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const { friend_name, occasion, occasion_date } = req.body;
    const newFriend = { friend_name, occasion, occasion_date };

    for (const [key, value] of Object.entries(newFriend))
      if (value == null)
        return res.status(400).json({
          error: `Mising '${key}' in request body`,
        });

    newFriend.user_id = req.user.id;

    FriendsService.insertFriend(req.app.get('db'), newFriend).then((friend) => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${friend.id}`))
        .json(friend);
    });
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
  })
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const { likes } = req.body;

    for (const [key, value] of Object.entries(likes))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`,
        });

    const friendId = req.params.friend_id;

    Promise.all(
      likes.map((newLike) => {
        newLike.friend_id = friendId;
        return FriendsService.insertLike(
          req.app.get('db'),
          newLike,
          req.user.id
        );
      })
    ).then((allLikes) => {
      res.status(201).json(allLikes);
    });
  });

async function checkFriendExists(req, res, next) {
  try {
    const friend = await FriendsService.getFriendById(
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
