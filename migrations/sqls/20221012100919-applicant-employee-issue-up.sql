CREATE OR REPLACE FUNCTION applicant_employee()
RETURNS TRIGGER AS
$$
BEGIN
  IF NEW.status = 'HIRED' AND NOT EXISTS (SELECT id FROM employees WHERE identity_id=NEW.user_id AND project_id=NEW.project_id) THEN
    INSERT INTO employees (project_id, identity_id, applicant_id) VALUES (
      NEW.project_id,
      NEW.user_id,
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
