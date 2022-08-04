CREATE TYPE proj_type AS ENUM ('ONE_OFF', 'PART_TIME', 'FULL_TIME');

CREATE TYPE project_length AS ENUM ('LESS_THAN_A_DAY', 'LESS_THAN_A_MONTH', '1_3_MONTHS', '3_6_MONTHS', '6_MONTHS_OR_MORE');

CREATE TABLE IF NOT EXISTS public.projects(
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  identity_id uuid NOT NULL,
  title varchar(200),
  description text,
  project_type proj_type DEFAULT NULL,
  project_length proj_length DEFAULT NULL,
  country_id int DEFAULT NULL,
  payment_type int,
  payment_scheme int,
  payment_currency varchar(200) DEFAULT NULL,
  payment_range_lower varchar(200) DEFAULT NULL,
  payment_range_higher varchar(200) DEFAULT NULL,
  experience_level int,
  project_status int,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp,
  CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE CASCADE
);
