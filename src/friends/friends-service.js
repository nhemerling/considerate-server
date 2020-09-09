const xss = require('xss');

const FriendsService = {
  getUserFriends(db, user_id) {
    return db
      .from('considerate_friends AS fr')
      .select(
        'fr.id',
        'fr.friend_name',
        'fr.occasion',
        'fr.occasion_date',
        ...userFields
      )
      .where('fr.user_id', user_id)
      .leftJoin('considerate_users AS usr', 'fr.user_id', 'usr.id')
      .groupBy('fr.id', 'usr.id');
  },

  getFriendById(db, friend_id, user_id) {
    return db
      .from('considerate_friends AS fr')
      .select(
        'fr.id',
        'fr.friend_name',
        'fr.occasion',
        'fr.occasion_date',
        ...userFields
      )
      .where('fr.user_id', user_id)
      .andWhere('fr.id', friend_id)
      .leftJoin('considerate_users AS usr', 'fr.user_id', 'usr.id')
      .groupBy('fr.id', 'usr.id')
      .first();
  },

  getLikesForFriend(db, friend_id, user_id) {
    return db
      .from('considerate_likes AS lik')
      .select('lik.id', 'lik.like_name', ...userFields)
      .where('fr.user_id', user_id)
      .andWhere('fr.id', friend_id)
      .leftJoin('friend_likes AS fl', 'lik.id', 'fl.like_id')
      .leftJoin('considerate_friends AS fr', 'fl.friend_id', 'fr.id')
      .leftJoin('considerate_users AS usr', 'fr.user_id', 'usr.id')
      .groupBy('lik.id', 'fr.id', 'usr.id');
  },

  insertFriend(db, newFriend) {
    return db
      .insert(newFriend)
      .into('considerate_friends')
      .returning('*')
      .then(([friend]) =>
        FriendsService.getFriendById(db, friend.id, friend.user_id)
      );
  },

  getLikeById(db, like_id) {
    return db
      .from('considerate_likes AS lk')
      .select('lk.id', 'lk.like_name')
      .where('lk.id', like_id)
      .first();
  },

  insertLike(db, newLike, user_id) {
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
            FriendsService.getLikesForFriend(db, friend_like.friend_id, user_id)
          )
      );
  },

  deleteFriend(db, id) {
    return db('considerate_friends').where({ id }).delete();
  },

  updateFriend(db, id, newFriendFields) {
    return db('considerate_friends').where({ id }).update(newFriendFields);
  },

  serializeFriends(friends) {
    return friends.map(this.serializeFriend);
  },

  serializeFriend(friend) {
    return {
      id: friend.id,
      friend_name: xss(friend.friend_name),
      occasion: xss(friend.occasion),
      occasion_date: friend.occasion_date,
      user_id: friend.user_id,
    };
  },

  serializeFriendLikes(likes) {
    return likes.map(this.serializeFriendLike);
  },

  serializeFriendLike(like) {
    return {
      id: like.id,
      like_name: xss(like.like_name),
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

module.exports = FriendsService;
