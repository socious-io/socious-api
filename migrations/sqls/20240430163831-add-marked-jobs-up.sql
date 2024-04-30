CREATE TYPE job_mark_type AS ENUM ('SAVE', 'NOT_INTERESTED');

CREATE TABLE job_marks (
  id                   uuid                            NOT NULL DEFAULT public.uuid_generate_v4() PRIMARY KEY,
  identity_id          uuid                            NOT NULL,
  job_id               uuid                            NOT NULL,
  type                 job_mark_type                   NOT NULL DEFAULT 'SAVE',
  created_at           timestamp with time zone        NOT NULL DEFAULT now(),
  CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE CASCADE,
  CONSTRAINT fk_job FOREIGN KEY (job_id) REFERENCES projects(id) ON DELETE CASCADE
);
