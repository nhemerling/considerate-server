const xss = require('xss');

const FriendsService = {
  getUserFriends(db) {
    return db.from('considerate_friends AS friends').select;
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
