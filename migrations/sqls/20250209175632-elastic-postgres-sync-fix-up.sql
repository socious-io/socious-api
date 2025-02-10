CREATE OR REPLACE FUNCTION notify_elastic_update()
RETURNS TRIGGER AS $$
DECLARE
  payload JSON;
BEGIN

  IF (TG_OP = 'DELETE') THEN
    payload := json_build_object(
      'operation', TG_OP,
      'table', TG_TABLE_NAME,
      'id', OLD.id
    );
  ELSE
    payload := json_build_object(
      'operation', TG_OP,
      'table', TG_TABLE_NAME,
      'id', NEW.id
    );
  END IF;
  
  PERFORM pg_notify('elastic_update', payload::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER elastic_update_trigger_users
AFTER INSERT OR UPDATE OR DELETE ON users
FOR EACH ROW EXECUTE FUNCTION notify_elastic_update();

CREATE OR REPLACE TRIGGER elastic_update_trigger_organizations
AFTER INSERT OR UPDATE OR DELETE ON organizations
FOR EACH ROW EXECUTE FUNCTION notify_elastic_update();

CREATE OR REPLACE TRIGGER elastic_update_trigger_projects
AFTER INSERT OR UPDATE OR DELETE ON projects
FOR EACH ROW EXECUTE FUNCTION notify_elastic_update();

CREATE OR REPLACE TRIGGER elastic_update_trigger_countries
AFTER INSERT OR UPDATE OR DELETE ON countries
FOR EACH ROW EXECUTE FUNCTION notify_elastic_update();

CREATE OR REPLACE TRIGGER elastic_update_trigger_geonames
AFTER INSERT OR UPDATE OR DELETE ON geonames
FOR EACH ROW EXECUTE FUNCTION notify_elastic_update();
