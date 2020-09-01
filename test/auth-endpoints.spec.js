const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const supertest = require('supertest');
const jwt = require('jsonwebtoken');

describe('Auth Endpoint', function () {
  let db;

  const { testUsers } = helpers.makeThingsFixtures();
  const testUser = testUsers[0];

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));
  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('POST /api/auth/login', () => {
    beforeEach('insert users', () => helpers.seedUsers(db, testUsers));

    const requiredFields = ['user_name', 'password'];

    requiredFields.forEach((field) => {
      const loginAttemptBody = {
        user_name: testUser.user_name,
        password: testUser.password,
      };

      it(`responds with 400 required error when '${field}' is missing`, () => {
        delete loginAttemptBody[field];

        return supertest(app)
          .post('/api/auth/login')
          .send(loginAttemptBody)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          });
      });
    });

    it('responds 400 \'invalid user_name or password\' when bad user_name', () => {
      const badUser = { user_name: 'not-user', password: 'good-pass' };
      return supertest(app)
        .post('/api/auth/login')
        .send(badUser)
        .expect(400, { error: 'Incorrect user_name or password' });
    });

    it('responds 400 \'invalid user_name or password\' when bad password', () => {
      const badPass = { user_name: 'dunder', password: 'bad-pass' };
      return supertest(app)
        .post('/api/auth/login')
        .send(badPass)
        .expect(400, { error: 'Incorrect user_name or password' });
    });

    it('responds 200 and JWT auth token using secret when valid credentials', () => {
      const userValidCreds = {
        user_name: testUser.user_name,
        password: testUser.password,
      };
      const expectedToken = jwt.sign(
        { user_id: testUser.id }, // payload
        process.env.JWT_SECRET,
        { subject: testUser.user_name, algorithm: 'HS256' }
      );
      return supertest(app)
        .post('/api/auth/login')
        .send(userValidCreds)
        .expect(200, {
          authToken: expectedToken,
        });
    });
  });
});
