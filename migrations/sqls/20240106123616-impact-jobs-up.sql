ALTER TABLE projects ADD COLUMN impact_job boolean DEFAULT true;

CREATE OR REPLACE FUNCTION active_by_impact_job()
RETURNS TRIGGER AS
$$
BEGIN
  IF NEW.impact_job = FALSE THEN
    NEW.status := 'EXPIRE';
  END IF;
  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;


CREATE TRIGGER update_project_on_impact
    BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION active_by_impact_job();

CREATE TRIGGER insert_project_on_impact
    BEFORE INSERT ON projects FOR EACH ROW EXECUTE FUNCTION active_by_impact_job();
