
CREATE TYPE submit_works_status_type AS ENUM (
  'PENDING',
  'CONFIRMED'
);

CREATE TABLE submitted_works (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  status submit_works_status_type NOT NULL DEFAULT 'PENDING',
  project_id uuid NOT NULL,
  mission_id uuid NOT NULL,
  total_hours int DEFAULT 0,
  start_at timestamp NOT NULL,
  end_at timestamp NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
  CONSTRAINT fk_mission FOREIGN KEY (mission_id) REFERENCES missions(id) ON DELETE SET NULL
);


ALTER TABLE impact_points_history ADD COLUMN submitted_work_id uuid;
ALTER TABLE impact_points_history
  ADD CONSTRAINT fk_submitted_works FOREIGN KEY (submitted_work_id) REFERENCES submitted_works(id) ON DELETE SET NULL;
