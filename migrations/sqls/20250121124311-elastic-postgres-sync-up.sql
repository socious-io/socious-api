CREATE OR REPLACE FUNCTION notify_elastic_update()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'elastic_update',
    json_build_object(
      'operation', TG_OP,
      'table', TG_TABLE_NAME,
      'data', row_to_json(NEW)
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER elastic_update_trigger_users
AFTER INSERT OR UPDATE OR DELETE ON users
FOR EACH ROW EXECUTE FUNCTION notify_elastic_update();

CREATE TRIGGER elastic_update_trigger_organizations
AFTER INSERT OR UPDATE OR DELETE ON users
FOR EACH ROW EXECUTE FUNCTION notify_elastic_update();

CREATE TRIGGER elastic_update_trigger_projects
AFTER INSERT OR UPDATE OR DELETE ON users
FOR EACH ROW EXECUTE FUNCTION notify_elastic_update();

CREATE TRIGGER elastic_update_trigger_locations
AFTER INSERT OR UPDATE OR DELETE ON locations
FOR EACH ROW EXECUTE FUNCTION notify_elastic_update();
