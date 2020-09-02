const express = require('express');
const path = require('path');
const LikesService = require('./likes-service');
const { requireAuth } = require('../middleware/jwt-auth');
const { json } = require('express');

const likesRouter = express.Router();
const jsonBodyParser = express.json();

likesRouter.route('/').post(requireAuth, jsonBodyParser, (req, res, next) => {
  const { like_name, friend_id } = req.body;
  const newLike = { like_name, friend_id };

  for (const [key, value] of Object.entries(newLike))
    if (value == null)
      return res.status(400).json({
        error: `Missing '${key}' in request body`,
      });

  newLike.user_id = req.user.id;

  LikesService.insertLike(req.app.get('db'), newLike).then((like) => {
    res
      .status(201)
      .location(path.posix.join(req.originalUrl, `/${like.id}`))
      .json(like);
  });
});

module.exports = likesRouter;
