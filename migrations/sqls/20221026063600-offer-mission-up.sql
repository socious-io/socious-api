ALTER TABLE employees RENAME TO missions;

CREATE TYPE offers_status_type AS ENUM (
  'PENDING', 'WITHDRAWN', 'APPROVED', 'HIRED', 'CLOSED', 'CANCELED'
);

CREATE TABLE offers (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  project_id uuid NOT NULL,
  recipient_id uuid NOT NULL,
  offerer_id uuid NOT NULL,
  applicant_id uuid,
  assignment_total float DEFAULT 0,
  offer_rate float DEFAULT 0,
  offer_message text,
  status offers_status_type DEFAULT 'PENDING',
  payment_type payment_type,
  due_date timestamp,
  payment_scheme payment_scheme,
  weekly_limit int,
  total_hours int DEFAULT 1,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_identity_recipient FOREIGN KEY (recipient_id) REFERENCES identities(id) ON DELETE CASCADE,
  CONSTRAINT fk_identity_offerer FOREIGN KEY (offerer_id) REFERENCES identities(id) ON DELETE CASCADE,
  CONSTRAINT fk_applicant FOREIGN KEY (applicant_id) REFERENCES applicants(id) ON DELETE SET NULL
);


ALTER TABLE applicants 
  DROP COLUMN weekly_limit,
  DROP COLUMN total_hours,
  DROP COLUMN due_date,
  DROP COLUMN assignment_total;

DROP TRIGGER applicant_employee ON applicants;
DROP FUNCTION applicant_employee;

DROP TRIGGER employees_status ON missions;
DROP FUNCTION employees_status;

CREATE TYPE mission_status AS ENUM ('ACTIVE', 'COMPLETE', 'CONFIRMED', 'CANCELED', 'KICKED_OUT');

ALTER TABLE missions ALTER COLUMN applicant_id DROP NOT NULL;
ALTER TABLE missions RENAME COLUMN identity_id TO assignee_id;
ALTER TABLE missions ADD COLUMN assigner_id uuid NOT NULL;
ALTER TABLE missions ADD COLUMN offer_id uuid NOT NULL;
ALTER TABLE missions ADD CONSTRAINT fk_offer FOREIGN KEY (offer_id) REFERENCES offers(id) ON DELETE CASCADE;
ALTER TABLE missions ADD CONSTRAINT fk_identity_assigner FOREIGN KEY (assigner_id) REFERENCES identities(id) ON DELETE CASCADE;
ALTER TABLE missions DROP COLUMN status;
ALTER TABLE missions ADD COLUMN status mission_status DEFAULT 'ACTIVE';

ALTER TABLE feedbacks RENAME COLUMN employee_id TO mission_id;
ALTER TABLE feedbacks RENAME CONSTRAINT fk_employee TO fk_mission;


DROP TYPE employee_status;


CREATE FUNCTION offer_accepted()
RETURNS TRIGGER AS
$$
BEGIN
  IF NEW.status = 'HIRED' AND NOT EXISTS (SELECT id FROM missions WHERE assignee_id=NEW.recipient_id AND project_id=NEW.project_id) THEN
    INSERT INTO missions (project_id, assignee_id, assigner_id, offer_id, applicant_id) VALUES (
      NEW.project_id,
      NEW.recipient_id,
      NEW.offerer_id,
      NEW.id,
      NEW.applicant_id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER offer_accepted
    AFTER UPDATE ON offers FOR EACH ROW EXECUTE FUNCTION offer_accepted();


CREATE OR REPLACE FUNCTION missions_status()
RETURNS TRIGGER AS
$$
BEGIN
  IF NEW.status <> 'ACTIVE' THEN
    UPDATE applicants SET status = 'CLOSED' WHERE id=NEW.applicant_id;
    UPDATE offers SET status = 'CLOSED' WHERE id=NEW.offer_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER missions_status
    AFTER UPDATE ON missions FOR EACH ROW EXECUTE FUNCTION missions_status();
