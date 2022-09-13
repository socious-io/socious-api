ALTER TABLE projects 
ADD COLUMN other_party_id varchar(60) DEFAULT NULL, 
ADD COLUMN other_party_title varchar(250) DEFAULT NULL, 
ADD COLUMN other_party_url text DEFAULT NULL;
