
ALTER TABLE applicants 
ADD COLUMN weekly_limit int
ADD COLUMN estimation_total_hours int DEFAULT 1;

CREATE TABLE employees (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  identity_id uuid NOT NULL,
  project_id uuid NOT NULL,
  applicant_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE CASCADE,
  CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_applicant FOREIGN KEY (applicant_id) REFERENCES applicants(id)
);


CREATE INDEX idx_identity_project ON employees (identity_id, project_id);


CREATE FUNCTION applicant_employee()
RETURNS TRIGGER AS
$$
BEGIN
  CASE
    WHEN NEW.status = 'HIRED' AND NOT EXISTS (SELECT id FROM employees WHERE identity_id=NEW.identity_id AND project_id=NEW.project_id) THEN
    INSERT INTO employees (project_id, identity_id, applicant_id) VALUES (
      NEW.project_id,
      NEW.identity_id,
      NEW.id
    );
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
