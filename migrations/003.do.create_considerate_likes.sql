ALTER TABLE IF EXISTS considerate_friends
  DROP COLUMN likes;

CREATE TABLE considerate_likes (
  id SERIAL PRIMARY KEY,
  like_name TEXT NOT NULL
);

CREATE TABLE friend_likes (
  friend_id INTEGER REFERENCES considerate_friends(id),
  like_id INTEGER REFERENCES considerate_likes(id),
  PRIMARY KEY (friend_id, like_id)
);