CREATE TYPE employment_type AS ENUM ('ONE_OFF', 'PART_TIME', 'FULL_TIME');

ALTER TABLE experiences 
  ADD COLUMN country text,
  ADD COLUMN city text,
  ADD COLUMN employment_type employment_type,
  ADD COLUMN job_category_id uuid;

  ALTER TABLE experiences ADD CONSTRAINT fk_job_category FOREIGN KEY (job_category_id) REFERENCES job_categories(id);
