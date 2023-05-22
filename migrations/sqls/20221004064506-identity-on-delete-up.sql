ALTER TABLE chats_participants ALTER COLUMN joined_by DROP NOT NULL;

ALTER TABLE chats_participants DROP CONSTRAINT fk_joined_by_identity;

ALTER TABLE chats_participants ADD CONSTRAINT fk_joined_by_identity FOREIGN KEY (joined_by) REFERENCES identities(id) ON DELETE SET NULL;
