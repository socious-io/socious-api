ALTER TYPE project_remote_preference_type RENAME VALUE 'REMOOTE' TO 'REMOTE';
ALTER TABLE projects 
ADD COLUMN other_party_id varchar(60) DEFAULT NULL, 
ADD COLUMN other_party_title varchar(250) DEFAULT NULL, 
ADD COLUMN other_party_url text DEFAULT NULL,
ADD UNIQUE(other_party_id, other_party_title);
