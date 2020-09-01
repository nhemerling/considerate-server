ALTER TABLE considerate_friends
  DROP COLUMN IF EXISTS user_id;

DROP TABLE IF EXISTS considerate_users CASCADE;
