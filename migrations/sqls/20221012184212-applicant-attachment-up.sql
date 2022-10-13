ALTER TABLE applicants ADD COLUMN attachment uuid;

ALTER TABLE applicants
  ADD CONSTRAINT fk_media FOREIGN KEY (attachment) REFERENCES media(id) ON DELETE SET NULL;
