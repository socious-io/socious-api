ALTER TABLE organizations
  ADD COLUMN other_party_id varchar(60), 
  ADD COLUMN other_party_title varchar(250), 
  ADD COLUMN other_party_url text;

CREATE INDEX idx_matrix_unique ON organizations (other_party_id, other_party_title);
