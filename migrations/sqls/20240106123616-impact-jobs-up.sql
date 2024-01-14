ALTER TABLE projects ADD COLUMN impact_job boolean DEFAULT true;


CREATE OR REPLACE FUNCTION active_by_impact_job()
  RETURNS TRIGGER AS
$$
BEGIN
  UPDATE projects SET status='EXPIRE' WHERE id=NEW.id AND impact_job=false;
  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;


CREATE TRIGGER update_project_on_impact
    AFTER UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION active_by_impact_job();

CREATE TRIGGER insert_identity
    AFTER INSERT ON projects FOR EACH ROW EXECUTE FUNCTION active_by_impact_job();
