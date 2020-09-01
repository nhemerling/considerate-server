const xss = require('xss');
const Treeize = require('treeize');

const FriendsService = {
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
