# Considerate Server

This is the server for the Considerate App.

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
