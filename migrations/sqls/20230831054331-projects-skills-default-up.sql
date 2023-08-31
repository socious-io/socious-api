ALTER TABLE projects 
    ALTER COLUMN skills SET DEFAULT '{}';

UPDATE projects SET skills='{}' where skills IS NULL;
