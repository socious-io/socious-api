CREATE TYPE project_mark_type AS ENUM ('SAVE', 'NOT_INTERESTED');

CREATE TABLE project_marks (
  id                   uuid                            NOT NULL DEFAULT public.uuid_generate_v4() PRIMARY KEY,
  identity_id          uuid                            NOT NULL,
  project_id           uuid                            NOT NULL,
  marked_as            project_mark_type               NOT NULL DEFAULT 'SAVE',
  created_at           timestamp with time zone        NOT NULL DEFAULT now(),
  UNIQUE (identity_id, project_id),
  CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE CASCADE,
  CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
