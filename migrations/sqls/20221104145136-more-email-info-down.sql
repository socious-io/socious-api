ALTER TABLE emails DROP COLUMN "to";
ALTER TABLE emails DROP COLUMN subject;
ALTER TABLE emails DROP COLUMN body;
ALTER TABLE emails DROP COLUMN body_type;
ALTER TABLE emails DROP COLUMN service;

ALTER TABLE emails ADD COLUMN message_id varchar(255);
UPDATE emails SET message_id = id;
ALTER TABLE emails ALTER COLUMN message_id SET NOT NULL;

DROP TYPE email_service_type;
