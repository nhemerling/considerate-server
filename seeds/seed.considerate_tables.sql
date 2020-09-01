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

INSERT INTO considerate_friends (friend_name, occasion, occasion_date, loves, user_id)
VALUES
  ('Jill', 'Birthday', '2020-09-05', '{"Cheese", "Wine", "Blue"}', 1),
  ('Steve', 'Birthday', '2020-09-02', '{"France", "Wine", "Green"}', 2),
  ('Frank', 'New Job', '2020-09-03', '{"Tech", "Bread", "Horses"}', 3),
  ('Ruby', 'Birthday', '2019-09-14', '{"Sauce", "Saturdays"}', 4),
  ('Bel', 'Anniversary', '2020-11-30', '{"Guitar", "Music", "Magnets"}', 5),
  ('Samson', 'Graduation', '2021-11-14', '{"Live Shows", "Basketball", "Black"}', 6),
  ('Charlie', 'Birthday', '2020-12-31', '{"Beer", "Seven"}', 2);

COMMIT;