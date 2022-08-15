CREATE TYPE applicants_status_type AS ENUM (
  'PENDING', 'OFFERED', 'REJECTED', 'WITHDRAWN', 'APPROVED', 'HIRED'
);

CREATE TYPE payment_type AS ENUM (
  'VOLUNTEER', 'PAID'
);

CREATE TYPE payment_scheme AS ENUM (
  'HOURLY', 'FIXED'
);

CREATE TYPE project_status AS ENUM (
  'DRAFT', 'EXPIRE', 'ACTIVE'
);

ALTER TABLE applicants
  DROP CONSTRAINT fk_identity;

ALTER TABLE applicants 
  DROP COLUMN identity_id;

ALTER TABLE applicants 
  DROP COLUMN application_status,
  DROP COLUMN payment_type;

ALTER TABLE projects 
  DROP COLUMN project_status,
  DROP COLUMN payment_type,
  DROP COLUMN payment_scheme;

ALTER TABLE projects 
  ADD COLUMN status project_status,
  ADD COLUMN payment_type payment_type,
  ADD COLUMN payment_scheme payment_scheme DEFAULT 'FIXED';

ALTER TABLE applicants
  ADD COLUMN assignment_total int DEFAULT 0,
  ADD COLUMN due_date timestamp,
  Add COLUMN feedback text,
  ADD COLUMN status applicants_status_type DEFAULT 'PENDING',
  ADD COLUMN payment_type payment_type DEFAULT 'PAID';
