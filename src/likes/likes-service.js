const xss = require('xss');
const Treeize = require('treeize');

const LikesService = {
  getById(db, like_id) {
    return db
      .from('considerate_likes AS lk')
      .select('lk.id', 'lk.like_name')
      .where('lk.id', like_id)
      .first();
  },

  insertLike(db, newLike) {
    return db
      .insert({
        like_name: newLike.like_name,
      })
      .into('considerate_likes')
      .returning('*')
      .then(([like]) => like)
      .then((like) =>
        db
          .insert({
            friend_id: newLike.friend_id,
            like_id: like.id,
          })
          .into('friend_likes')
          .returning('*')
          .then(([friend_like]) =>
            LikesService.getById(db, friend_like.like_id)
          )
      );
  },

  serializeLikes(likes) {
    return likes.map(this.serializeLike);
  },

  serializeLike(like) {
    const likeTree = new Treeize();
    const likeData = likeTree.grow([like]).getData()[0];
    return {
      id: likeData.id,
      like_name: xss(likeData.like_name),
    };
  },
};

const userFields = [
  'usr.id AS user:id',
  'usr.user_name AS user:user_name',
  'usr.full_name AS user:full_name',
  'usr.nickname AS user:nickname',
  'usr.date_created AS user:date_created',
  'usr.date_modified AS user:date_modified',
];

module.exports = LikesService;
