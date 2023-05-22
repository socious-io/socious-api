ALTER TABLE reports ADD COLUMN created_at timestamp with time zone DEFAULT now() NOT NULL;
