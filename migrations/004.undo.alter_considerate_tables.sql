BEGIN;

ALTER TABLE friend_likes
DROP CONSTRAINT friend_likes_friend_id_fkey;

ALTER TABLE friend_likes
ADD CONSTRAINT friend_likes_friend_id_fkey
FOREIGN KEY (friend_id)
REFERENCES considerate_friends(id);

COMMIT;