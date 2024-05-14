

CREATE OR REPLACE FUNCTION not_interest()
  RETURNS TRIGGER AS
$$
BEGIN
  IF NEW.marked_as = 'NOT_INTERESTED' THEN
    UPDATE recommends SET is_active=false WHERE identity_id=NEW.identity_id AND entity_id=NEW.project_id;
  END IF;
  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;


CREATE TRIGGER not_interested
    AFTER INSERT ON project_marks FOR EACH ROW EXECUTE FUNCTION not_interest();
