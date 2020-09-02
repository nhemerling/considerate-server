BEGIN;

TRUNCATE
  considerate_friends,
  considerate_users,
  considerate_likes,
  friend_likes
  RESTART IDENTITY CASCADE;

INSERT INTO considerate_users (user_name, full_name, nickname, password)
VALUES
  ('dunder', 'Dunder Mifflin', null, '$2a$12$0o3FGLJqDqYeYrnD0zKJz.3xd.ZRK7b/V9pC12Ifv1sl44tPX5yeO'),
  ('b.deboop', 'Bodeep Deboop', 'Bo', '$2a$12$.kRy54i0T9MpZigTvLKYfe.175.bZcE2Mz6jbcoYNIkJzjHa3ESV2'),
  ('c.bloggs', 'Charlie Bloggs', 'Charlie', '$2a$12$4VGYLFoWcwxUaHRbe2UcE.bqy7nNRGdRKkpSDMsEUNMJNhSrSEauy'),
  ('s.smith', 'Sam Smith', 'Sam', '$2a$12$ZnAh6j8Mcxh39.7hj10WlOrwMyH1VZkdROKLw6NSr1mKWJjQFf2Sy'),
  ('lexlor', 'Alex Taylor', 'Lex', '$2a$12$BjMp43IJU8a2dcvDQANXyeUmmu.VkRRDwfRXnfVzo7L9OSQQnYL0e'),
  ('wippy', 'Ping Won In', 'Ping', '$2a$12$7z3QWZavi0oi2kySrnO.M./YcPDNWHFhhJg60bEbiR3d7y4Hdwwje');

INSERT INTO considerate_friends (friend_name, occasion, occasion_date, user_id)
VALUES
  ('Jill', 'Birthday', '2020-09-05', 1),
  ('Steve', 'Birthday', '2020-09-02', 2),
  ('Frank', 'New Job', '2020-09-03', 3),
  ('Ruby', 'Birthday', '2019-09-14', 4),
  ('Bel', 'Anniversary', '2020-11-30', 5),
  ('Samson', 'Graduation', '2021-11-14', 6),
  ('Charlie', 'Birthday', '2020-12-31', 2);

INSERT INTO considerate_likes (like_name)
VALUES
  ('Coke'),
  ('Cheese'),
  ('XBox'),
  ('PlayStation'),
  ('Horses'),
  ('Vanilla'),
  ('Journals');

INSERT INTO friend_likes (friend_id, like_id)
VALUES
  (1, 1),
  (1, 2),
  (1, 3),
  (2, 1),
  (2, 4),
  (3, 5),
  (3, 6),
  (4, 3),
  (4, 4),
  (4, 7),
  (5, 1),
  (5, 3),
  (6, 5),
  (6, 6),
  (6, 7);

COMMIT;