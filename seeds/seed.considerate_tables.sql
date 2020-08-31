BEGIN;

TRUNCATE
  considerate_friends,
  considerate_users
  RESTART IDENTITY CASCADE;

INSERT INTO considerate_users (user_name, full_name, nickname, password)
VALUES
  ('dunder', 'Dunder Mifflin', null, 'password'),
  ('b.deboop', 'Bodeep Deboop', 'Bo', 'bo-pass'),
  ('c.bloggs', 'Charlie Bloggs', 'Charlie', 'charlie-pass'),
  ('s.smith', 'Sam Smith', 'Sam', 'sam-pass'),
  ('lexlor', 'Alex Taylor', 'Lex', 'lex-pass'),
  ('wippy', 'Ping Won In', 'Ping', 'ping-pass');

INSERT INTO considerate_friends (friend_name, occasion, occasion_date, loves)
VALUES
  ('Jill', 'Birthday', '2020-09-01T21:39:10.721Z', 'Cheese, Wine, Blue'),
  ('Steve', 'Birthday', '2020-09-02T21:39:10.721Z', 'France, Wine, Green'),
  ('Frank', 'New Job', '2020-09-03T21:39:10.721Z', 'Tech, Bread, Horses'),
  ('Ruby', 'Birthday', '2019-09-14T21:39:10.721Z', 'Sauce, Saturdays'),
  ('Bel', 'Anniversary', '2020-11-31T21:39:10.721Z', 'Guitar, Music, Magnets'),
  ('Samson', 'Graduation', '2021-11-14T21:39:10.721Z', 'Live Shows, Basketball, Black'),
  ('Charlie', 'Birthday', '2020-12-31T21:39:10.721Z', 'Beer, Seven')
