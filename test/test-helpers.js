const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: 'test-user-1',
      full_name: 'Test user 1',
      nickname: 'TU1',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 2,
      user_name: 'test-user-2',
      full_name: 'Test user 2',
      nickname: 'TU2',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 3,
      user_name: 'test-user-3',
      full_name: 'Test user 3',
      nickname: 'TU3',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 4,
      user_name: 'test-user-4',
      full_name: 'Test user 4',
      nickname: 'TU4',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
  ];
}

function makeFriendsArray(users) {
  return [
    {
      id: 1,
      friend_name: 'First test friend!',
      occasion: 'Birthday',
      user_id: users[0].id,
      occasion_date: '2029-01-22T00:00:00.000Z',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 2,
      friend_name: 'First test friend!',
      occasion: 'Graduation',
      user_id: users[1].id,
      occasion_date: '2029-01-22T00:00:00.000Z',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 3,
      friend_name: 'First test friend!',
      occasion: 'Anniversary',
      user_id: users[2].id,
      occasion_date: '2029-01-22T00:00:00.000Z',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 4,
      friend_name: 'First test friend!',
      occasion: 'Birthday',
      user_id: users[3].id,
      occasion_date: '2029-01-22T00:00:00.000Z',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 5,
      friend_name: 'First test friend!',
      occasion: 'Birthday',
      user_id: users[0].id,
      occasion_date: '2029-01-22T00:00:00.000Z',
      date_created: '2029-01-22T16:28:32.615Z',
    },
  ];
}

function makeLikesArray() {
  return [
    {
      id: 1,
      like_name: 'First Like',
    },
    {
      id: 2,
      like_name: 'Second Like',
    },
    {
      id: 3,
      like_name: 'Third Like',
    },
    {
      id: 4,
      like_name: 'Fourth Like',
    },
    {
      id: 5,
      like_name: 'Fifth Like',
    },
  ];
}

function makeFriendLikesArray(friends, likes) {
  return [
    {
      friend_id: friends[0].id,
      like_id: likes[0].id,
    },
    {
      friend_id: friends[1].id,
      like_id: likes[1].id,
    },
    {
      friend_id: friends[2].id,
      like_id: likes[2].id,
    },
    {
      friend_id: friends[3].id,
      like_id: likes[3].id,
    },
    {
      friend_id: friends[4].id,
      like_id: likes[4].id,
    },
  ];
}

function makeExpectedFriend(friend) {
  return {
    id: friend.id,
    friend_name: friend.friend_name,
    occasion: friend.occasion,
    occasion_date: friend.occasion_date,
  };
}

function makeMaliciousFriend(user) {
  const maliciousFriend = {
    id: 911,
    date_created: new Date().toISOString(),
    friend_name: 'Naughty naughty very naughty <script>alert("xss");</script>',
    user_id: user.id,
    occasion_date: '2029-01-22T00:00:00.000Z',
    occasion:
      'Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
  };
  const expectedFriend = {
    ...makeExpectedFriend(maliciousFriend),
    friend_name:
      'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
    occasion:
      'Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.',
  };
  return {
    maliciousFriend,
    expectedFriend,
  };
}

function makeMaliciousFriendWithLikes(user) {
  const maliciousFriend = {
    id: 911,
    date_created: new Date().toISOString(),
    friend_name: 'Naughty naughty very naughty <script>alert("xss");</script>',
    user_id: user.id,
    occasion_date: '2029-01-22T00:00:00.000Z',
    occasion:
      'Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
    likes: [
      {
        like_name: 'Test like',
      },
    ],
  };
  const expectedFriend = {
    ...makeExpectedFriend(maliciousFriend),
    friend_name:
      'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
    occasion:
      'Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.',
  };
  return {
    maliciousFriend,
    expectedFriend,
  };
}

function makeExpectedFriendLikes(friendId, friendLikes, likes) {
  const expectedLikes = likes.filter(
    (like) =>
      like.id === friendLikes.like_id && friendLikes.friend_id === friendId
  );

  return expectedLikes.map((like) => {
    return {
      id: like.id,
      like_name: like.like_name,
    };
  });
}

function makeFriendsFixtures() {
  const testUsers = makeUsersArray();
  const testFriends = makeFriendsArray(testUsers);
  const testLikes = makeLikesArray();
  const testFriendLikes = makeFriendLikesArray(testFriends, testLikes);
  return { testUsers, testFriends, testLikes, testFriendLikes };
}

function cleanTables(db) {
  return db.transaction((trx) =>
    trx
      .raw(
        `TRUNCATE
      friend_likes,
      considerate_likes,
      considerate_friends,
      considerate_users`
      )
      .then(() =>
        Promise.all([
          trx.raw(
            'ALTER SEQUENCE considerate_likes_id_seq minvalue 0 START WITH 1'
          ),
          trx.raw(
            'ALTER SEQUENCE considerate_friends_id_seq minvalue 0 START WITH 1'
          ),
          trx.raw(
            'ALTER SEQUENCE considerate_users_id_seq minvalue 0 START WITH 1'
          ),
          trx.raw("SELECT setval('considerate_likes_id_seq', 0)"),
          trx.raw("SELECT setval('considerate_friends_id_seq', 0)"),
          trx.raw("SELECT setval('considerate_users_id_seq', 0)"),
        ])
      )
  );
}

function seedUsers(db, users) {
  const preppedUsers = users.map((user) => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1),
  }));
  return db
    .into('considerate_users')
    .insert(preppedUsers)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw("SELECT setval('considerate_users_id_seq', ?)", [
        users[users.length - 1].id,
      ])
    );
}

function seedFriendsTables(db, users, friends, likes = [], friendLikes) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async (trx) => {
    await seedUsers(trx, users);
    await trx.into('considerate_friends').insert(friends);
    // update the auto sequence to match the forced id values
    await trx.raw("SELECT setval('considerate_friends_id_seq', ?)", [
      friends[friends.length - 1].id,
    ]);
    // only insert likes if there are some, also update the sequence counter
    if (likes.length) {
      await trx.into('considerate_likes').insert(likes);
      await trx.raw("SELECT setval('considerate_likes_id_seq', ?)", [
        likes[likes.length - 1].id,
      ]);
      await trx.into('friend_likes').insert(friendLikes);
    }
  });
}

function seedMaliciousFriend(db, user, friend) {
  return seedUsers(db, [user]).then(() =>
    db.into('considerate_friends').insert([friend])
  );
}

function seedMaliciousFriendLike(db, user, friend, like, friendLike) {
  return db.transaction(async (trx) => {
    await seedUsers(trx, [user]);
    await trx.into('considerate_friends').insert([friend]);
    await trx.into('considerate_likes').insert([like]);
    await trx.into('friend_likes').insert([friendLike]);
  });
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256',
  });
  return `Bearer ${token}`;
}

module.exports = {
  makeUsersArray,
  makeFriendsArray,
  makeExpectedFriend,
  makeMaliciousFriend,
  makeMaliciousFriendWithLikes,
  makeExpectedFriendLikes,

  makeFriendsFixtures,
  cleanTables,
  seedFriendsTables,
  seedMaliciousFriend,
  seedMaliciousFriendLike,
  makeAuthHeader,
  seedUsers,
};
