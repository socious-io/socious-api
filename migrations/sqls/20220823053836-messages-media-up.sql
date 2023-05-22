ALTER TABLE messages
  ADD COLUMN media uuid;

ALTER TABLE messages
  ADD CONSTRAINT fk_media FOREIGN KEY (media) REFERENCES media(id) ON DELETE SET NULL;
