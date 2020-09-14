# Considerate Server

This is the server for the Considerate App.
Considerate helps you keep track of the things your friends like and of the occasions when you'd like to give them the perfect gift.
You can be the thoughtful friend you've always meant to be.

## Summary

This API is fully RESTful.
It allows one to create a new user.
It allows one to login with a valid user account, providing an auth token in the response.
It allows an authenticated user to GET, POST, DELETE, and PATCH friends and likes to the considerate databases.

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

## Open Endpoints

Open Endpoints require no authentication.

- Login : POST /api/auth/login/
- - Paramaters

| Name      | Type   | Description                                                |
| --------- | ------ | ---------------------------------------------------------- |
| user_name | string | must provide a valid user_name                             |
| password  | string | must provide the valid password for the provided user_name |

- - Success Response:
    `Status: 200 OK`
    `{ "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE2MDAwOTk5NjYsInN1YiI6ImR1bmRlciJ9.0UNZ0BQwyL1dNvA4OWfsDh1mL4mv6EfoIGDderPQeFQ" }`

- - Error Response:
    `Status: 400 Bad Request`
    `{ "error": "Incorrect user_name or password" }`

- Add New User : POST /api/users/
- - Paramaters

| Name      | Type   | Description                                                                                                                                            |
| --------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| user_name | string | Required and must not already be taken                                                                                                                 |
| password  | string | Required and must be between 8 and 72 characters long, not start with empty spaces, and contain 1 upper case, lower case, number and special character |
| full_name | string | Required                                                                                                                                               |
| nickname  | string | Optional                                                                                                                                               |

- - Success Response:
    `Status: 201 Created`
    `{ "user_name": "example", "password": "Passw0rd!", "full_name": "Example Exampleton", "nickname": "Xampy" }`

- - Error Responses:
    `Status: 400 Bad Request`
    `{ "error": "Missing [field] in request body" }`
    OR
    `Status: 400 Bad Request`
    `{ "error": "Username already taken" }`

## Endpoints that require Authentication

Closed enpoints require a valid Token to be included in the header of the request. A Token can be acquired from the Login view above.

If no Bearer Token is provided:

- - Error Response:
    `Status: 401 Unauthorized`
    `{ "error": "Missing bearer token" }`

### Friend related

Endpoints for viewing and manipulating the Friends that the Authenticated User has permissions to access.

- Show Friends : GET /api/friends/
- - Success Responses:
    `Status: 200 OK`
    `[]`
    OR
    `Status: 200 OK`
    `[ { "id": 1, "friend_name": "Jill", "occasion": "Birthday", "occasion_date": "2020-09-05T07:00:00.000Z" } ]`

- Show Specific Friend : GET /api/friends/:friend_id/
- - URL Parameters: `friend_id=[integer]` where `friend_id` is the ID of the friend on the server.

- - Success Responses:
    `Status: 200 OK`
    `{}`
    OR
    `Status: 200 OK`
    `{ "id": 1, "friend_name": "Jill", "occasion": "Birthday", "occasion_date": "2020-09-05T07:00:00.000Z" }`

- - Error Response:
    `Status: 404 Not Found`
    `{ "error": "Friend doesn't exist" }`

- Show Likes of Friend : GET /api/friends/:friend_id/likes/
- - URL Parameters: `friend_id=[integer]` where `friend_id` is the ID of the friend on the server.

- - Success Responses:
    `Status: 200 OK`
    `[]`
    OR
    `Status: 200 OK`
    `[{ "id": 2, "like_name": "Cheese"}, { "id": 1, "like_name": "Coke"}, { "id: 3, "like_name": "XBox" }]`

- - Error Response:
    `Status: 404 Not Found`
    `{ "error": "Friend doesn't exist" }`

- Delete Friend : DELETE /api/friends/:friend_id/
- - URL Parameters: `friend_id=[integer]` where `friend_id` is the ID of the friend on the server.

- - Success Response:
    `Status: 204 No Content`

- Add new Friend : POST /api/friends/
- - Parameters
    | Name | Type | Description |
    |---------------|--------|-----------------------------------------------------------------------------------------------|
    | friend_name | string | Required |
    | occasion | string | Required |
    | occasion_date | date | Required |
    | likes | array | Optional array of objects. Each object must have the key "like_name" with the value a string. |

- - Success Response:
    `Status: 201 Created`
    `{ "id": 8, "friend_name": "Friend", "occasion": "Birthday", "occasion_date": "2020-09-10T07:00:00.000Z" }`

- - Error Responses:
    `Status: 400 Bad Request`
    `{ "error": "Missing [field] in request body" }`

- Update Friend : PATCH /api/friends/:friend_id/
- - Parameters, must include at least one of the following:
    | Name | Type | Description |
    |---------------|--------|-------------|
    | friend_name | string | Optional |
    | occasion | string | Optional |
    | occasion_date | date | Optional |

- - Success Response:
    `Status: 204 No Content`

- - Error Response:
    `Status 400 Bad Response`
    `{ "error": "Request body must contain either 'friend_name', 'occasion' or 'occasion_date'", }`

## Screenshots

Registration Page
![RegistrationPage](https://user-images.githubusercontent.com/65194792/92969296-86c73b00-f431-11ea-9413-0756629fb068.png)

Login Page
![LoginPage](https://user-images.githubusercontent.com/65194792/92969275-7ca53c80-f431-11ea-99a5-e19dec69baa7.png)

Home Page
![HomePage](https://user-images.githubusercontent.com/65194792/92969314-90e93980-f431-11ea-99b9-cbec00e522e9.png)

Friends Page
![FriendsPage](https://user-images.githubusercontent.com/65194792/92969326-96df1a80-f431-11ea-89db-684da94c5d2f.png)

Add Friend Page
![AddFriendPage](https://user-images.githubusercontent.com/65194792/92969320-95155700-f431-11ea-9c58-9d48958c4ade.png)

Edit Friend Page
![EditFriendPage](https://user-images.githubusercontent.com/65194792/92969324-96468400-f431-11ea-8050-996a8756d3cd.png)

## Tech Used

This API uses Express, Node.js, and PostgreSQL.

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
