ALTER TYPE project_remote_preference_type RENAME TO project_remote_preference_type_old;

CREATE TYPE project_remote_preference_type AS ENUM ('ONSITE', 'REMOTE', 'HYBRID');

ALTER TABLE projects DROP COLUMN remote_preference;

ALTER TABLE projects ADD COLUMN remote_preference project_remote_preference_type;
