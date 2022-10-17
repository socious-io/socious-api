
CREATE TYPE employee_status AS ENUM ('ACTIVE', 'COMPLETE', 'CONFIRMED', 'CANCELED', 'KICKED_OUT');

ALTER TABLE employees 
  ADD COLUMN status employee_status DEFAULT 'ACTIVE',
  ADD COLUMN  complete_at timestamp,
  ADD COLUMN  updated_at timestamp;


ALTER TYPE applicants_status_type ADD VALUE 'CLOSED';

ALTER TABLE applicants
  ADD COLUMN closed_at timestamp;


CREATE TABLE feedbacks (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  content text,
  is_contest boolean,
  identity_id uuid NOT NULL,
  project_id uuid NOT NULL,
  employee_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE CASCADE
);


CREATE OR REPLACE FUNCTION employees_status()
RETURNS TRIGGER AS
$$
BEGIN
  IF NEW.status <> 'ACTIVE' THEN
    UPDATE applicants SET status = 'CLOSED' WHERE id=NEW.applicant_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER employees_status
    AFTER UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION employees_status();
