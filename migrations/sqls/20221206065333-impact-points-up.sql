CREATE TABLE job_categories (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  name text NOT NULL,
  hourly_wage_dollars float,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE skills ADD COLUMN job_category_id uuid;
ALTER TABLE skills
  ADD CONSTRAINT fk_job_category FOREIGN KEY (job_category_id) REFERENCES job_categories(id) ON DELETE SET NULL;


ALTER TABLE users RENAME COLUMN impact_score TO impact_points;
ALTER TABLE organizations RENAME COLUMN impact_score TO impact_points;


CREATE TABLE impact_points_history (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  total_points double precision NOT NULL DEFAULT 0,
  mission_id uuid,
  identity_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_mission FOREIGN KEY (mission_id) REFERENCES missions(id) ON DELETE SET NULL,
  CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE CASCADE
);


CREATE OR REPLACE FUNCTION update_user_impact_points()
RETURNS TRIGGER AS
$$
BEGIN
  UPDATE users SET impact_points = impact_points + NEW.total_points WHERE id=NEW.identity_id;
END;
$$
LANGUAGE PLPGSQL;


CREATE TRIGGER update_user_impact_points
    AFTER INSERT ON impact_points_history FOR EACH ROW EXECUTE FUNCTION update_user_impact_points();
