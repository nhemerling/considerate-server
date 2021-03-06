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
    const { friend_name, occasion, occasion_date, likes } = req.body;
    const fieldsToCheck = { friend_name, occasion, occasion_date, likes };
    const newFriend = { friend_name, occasion, occasion_date };

    for (const [key, value] of Object.entries(fieldsToCheck))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`,
        });

    newFriend.user_id = req.user.id;

    FriendsService.insertFriend(req.app.get('db'), newFriend).then((friend) => {
      Promise.all(
        likes.map((newLike) => {
          newLike.friend_id = friend.id;
          return FriendsService.insertLike(
            req.app.get('db'),
            newLike,
            req.user.id
          );
        })
      ).then((likes) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${friend.id}`))
          .json(FriendsService.serializeFriend(friend));
      });
    });
  });

friendsRouter
  .route('/:friend_id')
  .all(requireAuth)
  .all(checkFriendExists)
  .get((req, res) => {
    res.json(FriendsService.serializeFriend(res.friend));
  })
  .delete((req, res, next) => {
    FriendsService.deleteFriend(req.app.get('db'), req.params.friend_id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonBodyParser, (req, res, next) => {
    const { friend_name, occasion, occasion_date } = req.body;
    const friendToUpdate = { friend_name, occasion, occasion_date };

    const numberOfValues = Object.values(friendToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: `Request body must contain either 'friend_name', 'occasion' or 'occasion_date'`,
      });
    }

    FriendsService.updateFriend(
      req.app.get('db'),
      req.params.friend_id,
      friendToUpdate
    )
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
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
        res.json(FriendsService.serializeFriendLikes(likes));
      })
      .catch(next);
  })
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const { likes } = req.body;

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
