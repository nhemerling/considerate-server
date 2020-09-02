const xss = require('xss');
const Treeize = require('treeize');

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

  getById(db, friend_id, user_id) {
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

  serializeFriends(friends) {
    return friends.map(this.serializeFriend);
  },

  serializeFriend(friend) {
    const friendTree = new Treeize();
    const friendData = friendTree.grow([friend]).getData()[0];
    return {
      id: friendData.id,
      friend_name: xss(friendData.friend_name),
      occasion: xss(friendData.occasion),
      occasion_date: friendData.occasion_date,
      user_id: friendData.user_id,
    };
  },

  serializeFriendLikes(likes) {
    return likes.map(this.serializeFriendLike);
  },

  serializeFriendLike(like) {
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

module.exports = FriendsService;
