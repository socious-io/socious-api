CREATE TABLE search_history (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  identity_id uuid,
  body jsonb,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp,
  CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE CASCADE
);


CREATE OR REPLACE RULE upsert_search_history AS ON INSERT TO search_history
WHERE EXISTS(SELECT id FROM search_history WHERE updated_at + INTERVAL '30 second' > now() AND identity_id=NEW.identity_id LIMIT 1)
DO INSTEAD 
  UPDATE search_history SET updated_at=now(),body=NEW.body 
  WHERE id=(SELECT id FROM search_history WHERE updated_at + INTERVAL '30 second' > now() AND identity_id=NEW.identity_id LIMIT 1);
