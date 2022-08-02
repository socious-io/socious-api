CREATE TYPE proj_type AS ENUM ('One-off', 'Part-time', 'Full-time');

CREATE TYPE proj_length AS ENUM ('Less than a day', 'Less than a month', '1-3 months', '3-6 months', '6 months or more');

CREATE TABLE IF NOT EXISTS public.projects(
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  page_id int,
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
  deleted_at timestamp
);
