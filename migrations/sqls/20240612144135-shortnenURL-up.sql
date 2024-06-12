/* Replace with your SQL commands */
CREATE TABLE urls_shortens (
  id uuid NOT NULL DEFAULT public.uuid_generate_v4() PRIMARY KEY,
  long_url TEXT NOT NULL UNIQUE,
  short_id VARCHAR(16) NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);


CREATE OR REPLACE FUNCTION generate_short_id() RETURNS TEXT AS $$
DECLARE
    characters TEXT := '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    new_short_id TEXT := '';
    i INTEGER := 0;
BEGIN
    FOR i IN 1..8 LOOP  -- Change 8 to the desired length of the short_id
        new_short_id := new_short_id || substr(characters, floor(random() * length(characters) + 1)::int, 1);
    END LOOP;

    -- Ensure uniqueness by checking the database
    IF EXISTS (SELECT 1 FROM urls_shortens WHERE short_id = new_short_id) THEN
        RETURN generate_short_id();  -- Recursively call until a unique ID is found
    ELSE
        RETURN new_short_id;
    END IF;
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION set_short_id() RETURNS TRIGGER AS $$
BEGIN
    NEW.short_id := generate_short_id();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER urls_shortens_insert BEFORE INSERT ON urls_shortens FOR EACH ROW EXECUTE FUNCTION set_short_id();
