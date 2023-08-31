ALTER TABLE projects 
    ALTER COLUMN causes_tags SET DEFAULT '{}';

UPDATE projects SET causes_tags='{}' where causes_tags IS NULL;
