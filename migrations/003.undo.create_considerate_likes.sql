DROP TABLE IF EXISTS friend_likes CASCADE;
DROP TABLE IF EXISTS considerate_likes CASCADE;

ALTER TABLE IF EXISTS considerate_friends
  ADD COLUMN likes TEXT ARRAY;
