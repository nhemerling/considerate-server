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
      occasion_date: '2029-01-22',
      loves: ['love1', 'love2', 'love3'],
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 2,
      friend_name: 'First test friend!',
      occasion: 'Graduation',
      user_id: users[1].id,
      occasion_date: '2029-01-22',
      loves: ['love1', 'love2', 'love3'],
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 3,
      friend_name: 'First test friend!',
      occasion: 'Anniversary',
      user_id: users[2].id,
      occasion_date: '2029-01-22',
      loves: ['love1', 'love2', 'love3'],
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 4,
      friend_name: 'First test friend!',
      occasion: 'Birthday',
      user_id: users[3].id,
      occasion_date: '2029-01-22',
      loves: ['love1', 'love2', 'love3'],
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 5,
      friend_name: 'First test friend!',
      occasion: 'Birthday',
      user_id: users[2].id,
      occasion_date: '2029-01-22',
      loves: ['love1', 'love2', 'love3'],
      date_created: '2029-01-22T16:28:32.615Z',
    },
  ];
}

function makeExpectedFriend(users, friend) {
  const user = users.find((u) => u.id === friend.user_id);

  return {
    id: friend.id,
    friend_name: friend.friend_name,
    occasion: friend.occasion,
    occasion_date: friend.occasion_date,
    date_created: friend.date_created,
    loves: friend.loves,
    user: {
      id: user.id,
      user_name: user.user_name,
      full_name: user.full_name,
      nickname: user.nickname,
      date_created: user.date_created,
    },
  };
}

function makeMaliciousFriend(user) {
  const maliciousFriend = {
    id: 911,
    loves: ['love1', 'love2', 'love3'],
    date_created: new Date().toISOString(),
    friend_name: 'Naughty naughty very naughty <script>alert("xss");</script>',
    user_id: user.id,
    occasion_date: '2029-01-22',
    occasion:
      'Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
  };
  const expectedFriend = {
    ...makeExpectedFriend([user], maliciousFriend),
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

function makeFriendsFixtures() {
  const testUsers = makeUsersArray();
  const testFriends = makeFriendsArray(testUsers);
  return { testUsers, testFriends };
}

function cleanTables(db) {
  return db.transaction((trx) =>
    trx
      .raw(
        `TRUNCATE
      considerate_friends,
      considerate_users`
      )
      .then(() =>
        Promise.all([
          trx.raw(
            'ALTER SEQUENCE considerate_friends_id_seq minvalue 0 START WITH 1'
          ),
          trx.raw(
            'ALTER SEQUENCE considerate_users_id_seq minvalue 0 START WITH 1'
          ),
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

function seedFriendsTables(db, users, friends = []) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async (trx) => {
    await seedUsers(trx, users);
    await trx.into('considerate_friends').insert(friends);
    // update the auto sequence to match the forced id values
    await trx.raw("SELECT setval('considerate_friends_id_seq', ?)", [
      friends[friends.length - 1].id,
    ]);
    // only insert reviews if there are some, also update the sequence counter
    if (reviews.length) {
      await trx.into('considerate_reviews').insert(reviews);
      await trx.raw("SELECT setval('considerate_reviews_id_seq', ?)", [
        reviews[reviews.length - 1].id,
      ]);
    }
  });

  // return db
  //   .into('considerate_users')
  //   .insert(users)
  //   .then(() => db.into('considerate_friends').insert(friends));
}

function seedMaliciousFriend(db, user, friend) {
  // return db
  //   .into('considerate_users')
  //   .insert([user])
  return seedUsers(db, [user]).then(() =>
    db.into('considerate_friends').insert([friend])
  );
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

  makeFriendsFixtures,
  cleanTables,
  seedFriendsTables,
  seedMaliciousFriend,
  makeAuthHeader,
  seedUsers,
};
