CREATE TYPE email_service_type AS ENUM ('SMTP', 'SENDGRID', 'TEST');

ALTER TABLE emails ADD COLUMN "to" text;
ALTER TABLE emails ADD COLUMN subject text;
ALTER TABLE emails ADD COLUMN body text;
ALTER TABLE emails ADD COLUMN body_type text;
ALTER TABLE emails ADD COLUMN service email_service_type;

UPDATE emails SET
  id = message_id::uuid,
  service = (options->>'service')::email_service_type,
  "to" = info->'personalizations'->0->'to'->0->>'email',
  subject = info->>'subject',
  body = info->'content'->0->>'value',
  body_type = info->'content'->0->>'type';

ALTER TABLE emails ALTER COLUMN "to" SET NOT NULL;
ALTER TABLE emails ALTER COLUMN subject SET NOT NULL;
ALTER TABLE emails ALTER COLUMN body SET NOT NULL;
ALTER TABLE emails ALTER COLUMN body_type SET NOT NULL;
ALTER TABLE emails ALTER COLUMN service SET NOT NULL;
ALTER TABLE emails DROP COLUMN message_id;
