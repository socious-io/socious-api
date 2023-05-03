CREATE TYPE collector_jobs_services AS ENUM ('IDEALIST', 'RELIEFWEB');

CREATE TABLE IF NOT EXISTS collector_jobs (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  service collector_jobs_services NOT NULL,
  job_name varchar(250) NOT NULL,
  has_more boolean DEFAULT false,
  fetch_counter int DEFAULT 1,
  last_modified_date timestamp,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);
