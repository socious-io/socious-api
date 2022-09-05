ALTER TABLE projects DROP COLUMN country_id;

ALTER TABLE projects 
  ADD COLUMN skills text[],
  ADD COLUMN causes_tags social_causes_type[];
