const knex = require('knex');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const helpers = require('./test-helpers');
const supertest = require('supertest');
const { expect } = require('chai');
const { makeUsersArray } = require('./test-helpers');

describe.only('Friends Endpoints', function () {
  let db;

  const {
    testUsers,
    testFriends,
    testLikes,
    testFriendLikes,
  } = helpers.makeFriendsFixtures();

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('GET /api/friends', () => {
    context('Given no friends', () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));
      it('Responds with 200 and an empty list', () => {
        return supertest(app)
          .get('/api/friends')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, []);
      });
    });

    context('Given there are friends in the database', () => {
      beforeEach('insert friends', () =>
        helpers.seedFriendsTables(
          db,
          testUsers,
          testFriends,
          testLikes,
          testFriendLikes
        )
      );

      it('responds with 200 and all of the friends', () => {
        const testUser = testUsers[0];
        const testUserFriends = testFriends.filter(
          (friend) => friend.user_id === testUser.id
        );
        const expectedFriends = testUserFriends.map((friend) =>
          helpers.makeExpectedFriend(friend)
        );

        return supertest(app)
          .get('/api/friends')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200, expectedFriends);
      });
    });

    context('Given an XSS attack friend', () => {
      const testUser = helpers.makeUsersArray()[1];
      const { maliciousFriend, expectedFriend } = helpers.makeMaliciousFriend(
        testUser
      );

      beforeEach('insert malicious friend', () =>
        helpers.seedMaliciousFriend(db, testUser, maliciousFriend)
      );

      it('removes XSS attack content', () => {
        return supertest(app)
          .get('/api/friends')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200)
          .expect((res) => {
            expect(res.body[0].friend_name).to.eql(expectedFriend.friend_name);
            expect(res.body[0].occasion).to.eql(expectedFriend.occasion);
          });
      });
    });
  });

  describe('GET /api/friends/:friend_id', () => {
    context('Given no friends', () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));

      it('Responds with 404', () => {
        const friendId = 12345;
        return supertest(app)
          .get(`/api/friends/${friendId}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: `Friend doesn't exist` });
      });
    });

    context('Given there are friends in the database', () => {
      beforeEach('insert friends', () =>
        helpers.seedFriendsTables(
          db,
          testUsers,
          testFriends,
          testLikes,
          testFriendLikes
        )
      );

      it('Responds with 200 and the specific friend', () => {
        const friendId = 1;
        const testUser = testUsers[0];
        const userFriend = testFriends.filter(
          (friend) => friend.id === friendId
        )[0];
        const expectedFriend = helpers.makeExpectedFriend(userFriend);

        return supertest(app)
          .get(`/api/friends/${friendId}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200, expectedFriend);
      });
    });

    context('Given an XSS attack friend', () => {
      const testUser = helpers.makeUsersArray()[1];
      const { maliciousFriend, expectedFriend } = helpers.makeMaliciousFriend(
        testUser
      );

      beforeEach('insert malicious friend', () =>
        helpers.seedMaliciousFriend(db, testUser, maliciousFriend)
      );

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/friends/${maliciousFriend.id}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200)
          .expect((res) => {
            expect(res.body.friend_name).to.eql(expectedFriend.friend_name);
            expect(res.body.occasion).to.eql(expectedFriend.occasion);
          });
      });
    });
  });

  describe('GET /api/friends/:friend_id/likes', () => {
    context('Given no likes', () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));

      it('Responds with 404', () => {
        const friendId = 12345;
        return supertest(app)
          .get(`/api/friends/${friendId}/likes`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: `Friend doesn't exist` });
      });
    });

    context(`Given this friend has likes in the database`, () => {
      beforeEach('insert friends', () =>
        helpers.seedFriendsTables(
          db,
          testUsers,
          testFriends,
          testLikes,
          testFriendLikes
        )
      );

      it('Responds with 200 and the likes', () => {
        const friendId = 1;
        const expectedLikes = [
          {
            id: 1,
            like_name: 'First Like',
          },
        ];

        return supertest(app)
          .get(`/api/friends/${friendId}/likes`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedLikes);
      });
    });

    context(`Given an XSS attack like`, () => {
      const testUser = helpers.makeUsersArray()[0];
      const maliciousLike = {
        id: 911,
        like_name:
          'Naughty naughty very naughty <script>alert("xss");</script>',
      };
      const friendLike = {
        friend_id: testFriends[0].id,
        like_id: maliciousLike.id,
      };
      const expectedLike = {
        id: 911,
        like_name:
          'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
      };

      beforeEach('insert malicious like', () =>
        helpers.seedMaliciousFriendLike(
          db,
          testUser,
          testFriends[0],
          maliciousLike,
          friendLike
        )
      );

      it('Removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/friends/${testFriends[0].id}/likes`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200)
          .expect((res) => {
            expect(res.body[0].like_name).to.eql(expectedLike.like_name);
          });
      });
    });
  });

  describe('DELETE /api/friends/:friend_id', () => {
    context('Given no friends', () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));

      it('Responds with 404', () => {
        const friendId = 12345;
        return supertest(app)
          .get(`/api/friends/${friendId}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: `Friend doesn't exist` });
      });
    });

    context('Given there are friends in the database', () => {
      beforeEach('insert friends', () =>
        helpers.seedFriendsTables(
          db,
          testUsers,
          testFriends,
          testLikes,
          testFriendLikes
        )
      );

      it('Responds with 204 and removes the friend', () => {
        const friendIdToRemove = 1;
        const testUser = testUsers[0];
        const expectedFriends = testFriends.filter(
          (friend) => friend.id !== friendIdToRemove
        );

        return supertest(app)
          .delete(`/api/friends/${friendIdToRemove}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(204)
          .then((res) => {
            supertest(app)
              .get(`/api/friends`)
              .set('Authorization', helpers.makeAuthHeader(testUser))
              .expect(expectedFriends);
          });
      });
    });
  });

  describe('POST /api/friends', () => {
    beforeEach(() => helpers.seedUsers(db, testUsers));
    const testUser = testUsers[0];

    it('creates a friend, responding with 201 and the new friend', () => {
      const newFriend = {
        friend_name: 'Test new friend',
        occasion: 'Test new occasion',
        occasion_date: '2029-01-22T00:00:00.000Z',
        likes: [{ like_name: 'Test like' }],
      };

      return supertest(app)
        .post(`/api/friends`)
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(newFriend)
        .expect(201)
        .expect((res) => {
          expect(res.body.friend_name).to.eql(newFriend.friend_name);
          expect(res.body.occasion_date).to.eql(newFriend.occasion_date);
          expect(res.body.occasion).to.eql(newFriend.occasion);
        })
        .then((postRes) =>
          supertest(app)
            .get(`/api/friends/${postRes.body.id}`)
            .set('Authorization', helpers.makeAuthHeader(testUser))
            .expect((postRes) => {
              expect(postRes.body.friend_name).to.eql(newFriend.friend_name);
              expect(postRes.body.occasion).to.eql(newFriend.occasion);
              expect(postRes.body.occasion_date).to.eql(
                newFriend.occasion_date
              );
            })
        );
    });

    const requiredFields = [
      'friend_name',
      'occasion',
      'occasion_date',
      'likes',
    ];
    requiredFields.forEach((field) => {
      const newFriend = {
        friend_name: 'Test new friend',
        occasion: 'Test new occasion',
        occasion_date: '2029-01-22T00:00:00.000Z',
        likes: [{ like_name: 'Test like' }],
      };

      it(`responds with 400 and an error message when the ${field} is missing`, () => {
        delete newFriend[field];

        return supertest(app)
          .post(`/api/friends`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .send(newFriend)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          });
      });
    });

    it('Removes XSS attack content from response', () => {
      const {
        maliciousFriend,
        expectedFriend,
      } = helpers.makeMaliciousFriendWithLikes(testUsers[0]);
      return supertest(app)
        .post(`/api/friends`)
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .send(maliciousFriend)
        .then((res) => {
          expect(res.body.friend_name).to.eql(expectedFriend.friend_name);
          expect(res.body.occasion).to.eql(expectedFriend.occasion);
        });
    });
  });

  describe('PATCH /api/friends/:friend_id', () => {
    context('Given no friends', () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));

      it('Responds with 404', () => {
        const friendId = 12345;
        return supertest(app)
          .patch(`/api/friends/${friendId}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: `Friend doesn't exist` });
      });
    });

    context('Given there are friends in the database', () => {
      beforeEach('insert friends', () =>
        helpers.seedFriendsTables(
          db,
          testUsers,
          testFriends,
          testLikes,
          testFriendLikes
        )
      );

      it('Responds with 204 and updates the friend', () => {
        const idToUpdate = 1;
        const testUser = testUsers[0];
        const updateFriend = {
          friend_name: 'updated friend name',
          occasion: 'updated occasion',
          occasion_date: '2000-01-22T00:00:00.000Z',
        };
        const expectedFriend = {
          ...testFriends[idToUpdate - 1],
          ...updateFriend,
        };

        return supertest(app)
          .patch(`/api/friends/${idToUpdate}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .send(updateFriend)
          .expect(204)
          .then((res) => {
            supertest(app)
              .get(`/api/friends/${idToUpdate}`)
              .set('Authorization', helpers.makeAuthHeader(testUser))
              .expect(expectedFriend);
          });
      });

      it('Responds with 400 when no required fields supplied', () => {
        const idToUpdate = 1;
        const testUser = testUsers[0];
        return supertest(app)
          .patch(`/api/friends/${idToUpdate}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .send({ irrelevantField: 'foo' })
          .expect(400, {
            error: `Request body must contain either 'friend_name', 'occasion' or 'occasion_date'`,
          });
      });

      it('Responds with 204 when only updating a subset of fields', () => {
        const idToUpdate = 1;
        const testUser = testUsers[0];
        const updateFriend = {
          friend_name: 'updated friend name',
        };
        const expectedFriend = {
          ...testFriends[idToUpdate - 1],
          ...updateFriend,
        };

        return supertest(app)
          .patch(`/api/friends/${idToUpdate}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .send(updateFriend)
          .expect(204)
          .then((res) => {
            supertest(app)
              .get(`/api/friends/${idToUpdate}`)
              .set('Authorization', helpers.makeAuthHeader(testUser))
              .expect(expectedFriend);
          });
      });
    });
  });
});
