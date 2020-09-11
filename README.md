# Considerate Server

This is the server for the Considerate App.
Considerate helps you keep track of the things your friends like and of the occasions when you'd like to give them the perfect gift.
You can be the thoughtful friend you've always meant to be.

## Link to Live App

https://immense-bayou-75450.herokuapp.com/

## Where Components Live

- Migrations are found in `/migrations`
- Seeding and truncating database files are found in `/seeds`
- The knex instance and server are found in `/src/server.js`
- The various configurations are found in `/src/config.js`
- Middleware and error handling function are found in `/src/app.js`
- Authorization router and service are found in `/src/auth`
- User router and service are found in `/src/users`
- JWT middleware is found in `/src/middleware`
- Friends router and service are found in `/src/friends`
- Tests are found in `/test`

## Setting Up

- Install dependencies: `npm install`
- Create development and test databases: `createdb considerate`, `createdb considerate-test`
- Create database user: `createuser considerate`
- Grant privileges to new user in `psql`:
  - `GRANT ALL PRIVILEGES ON DATABASE considerate TO considerate`
  - `GRANT ALL PRIVILEGES ON DATABASE "considerate-test" TO considerate`
- Prepare environment file: `touch .env`
- Fill `.env` with your custom values for:
  - `NODE_ENV`
  - `PORT`
  - `DATABASE_URL`
  - `TEST_DATABASE_URL`
  - `JWT_SECRET`
  - `CLIENT_ORIGIN`
- Bootstrap development database: `npm run migrate`
- Bootstrap test database: `npm run migrate:test`

### Configuring Postgres

For tests involving time to run properly, your Postgres database must be configured to run in the UTC timezone.

1. Locate the `postgresql.conf` file for your Postgres installation.
   - OS X, Homebrew: `/usr/local/var/postgres/postgresql.conf`
2. Uncomment the `timezone` line and set it to `UTC` as follows:

```
# - Locale and Formatting -

datestyle = 'iso, mdy'
#intervalstyle = 'postgres'
timezone = 'UTC'
#timezone_abbreviations = 'Default'     # Select the set of available time zone
```

## Sample Data

- To seed the database for development: `psql -U considerate -d considerate -a -f seeds/seed.considerate_tables.sql`
- To clear seed data: `psql -U considerate -d considerate -a -f seeds/trunc.considerate_tables.sql`

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

Migrate the dev database `npm run migrate`

Migrate the test database `npm run migrate:test`
