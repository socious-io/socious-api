
ALTER TABLE skills DROP COLUMN job_category_id;

ALTER TABLE projects ADD COLUMN job_category_id uuid;

ALTER TABLE projects ADD CONSTRAINT fk_job_category FOREIGN KEY (job_category_id) REFERENCES job_categories(id);
