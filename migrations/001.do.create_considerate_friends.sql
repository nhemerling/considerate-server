CREATE TABLE considerate_friends (
  id SERIAL PRIMARY KEY,
  friend_name TEXT NOT NULL,
  occasion TEXT NOT NULL,
  occasion_date DATE NOT NULL,
  loves TEXT ARRAY,
  date_created TIMESTAMPTZ DEFAULT now() NOT NULL
);
