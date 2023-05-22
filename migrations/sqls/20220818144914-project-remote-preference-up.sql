CREATE TYPE project_remote_preference_type AS ENUM ('ONSITE', 'REMOOTE', 'HYBRID');

ALTER TABLE projects ADD COLUMN remote_preference project_remote_preference_type;
