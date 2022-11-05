CREATE TYPE connect_status AS ENUM ('PENDING', 'CONNECTED', 'BLOCKED');


CREATE TABLE IF NOT EXISTS connections (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  status connect_status NOT NULL DEFAULT 'PENDING',
  text text,
  requester_id uuid NOT NULL,
  requested_id uuid NOT NULL,
  connected_at timestamp,
  relation_id varchar(255) UNIQUE NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_identity_requester FOREIGN KEY (requester_id) REFERENCES identities(id) ON DELETE CASCADE,
  CONSTRAINT fk_identity_requested FOREIGN KEY (requested_id) REFERENCES identities(id) ON DELETE CASCADE
);



CREATE OR REPLACE FUNCTION generate_relation()
RETURNS TRIGGER AS
$$
BEGIN  
  NEW.relation_id := (SELECT array_to_string(array_agg(a), '-', '')
    FROM (
      SELECT unnest(array[NEW.requested_id::text, NEW.requester_id::text]) as a 
      ORDER BY a) s
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION follow_on_connect()
RETURNS TRIGGER AS
$$
BEGIN
    IF NEW.status = 'CONNECTED' THEN
      
      INSERT INTO follows (follower_identity_id, following_identity_id) 
      VALUES (NEW.requested_id, New.requester_id)
      ON CONFLICT (follower_identity_id, following_identity_id) DO NOTHING;
      
      INSERT INTO follows (follower_identity_id, following_identity_id) 
      VALUES (NEW.requester_id, New.requested_id)
      ON CONFLICT (follower_identity_id, following_identity_id) DO NOTHING;
    
    END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER relation
    BEFORE INSERT ON connections FOR EACH ROW EXECUTE FUNCTION generate_relation();


CREATE TRIGGER follow_on_connect
    AFTER UPDATE ON connections FOR EACH ROW EXECUTE FUNCTION follow_on_connect();
