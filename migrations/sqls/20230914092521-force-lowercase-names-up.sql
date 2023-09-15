CREATE OR REPLACE FUNCTION make_shotname_lowercase() 
RETURNS TRIGGER AS $$
DECLARE
    exists_shortname VARCHAR;
BEGIN
    NEW.shortname := LOWER(NEW.shortname);
    SELECT shortname INTO exists_shortname FROM organizations WHERE shortname=NEW.shortname AND id<>NEW.id;
    IF FOUND THEN
      NEW.shortname := NEW.shortname || '2';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER lowercase_trigger
BEFORE INSERT OR UPDATE
ON organizations
FOR EACH ROW
EXECUTE FUNCTION make_shotname_lowercase();


UPDATE organizations set id=id;
