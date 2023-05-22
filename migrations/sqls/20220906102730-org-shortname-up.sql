ALTER TABLE organizations ADD COLUMN shortname VARCHAR(200);

CREATE UNIQUE INDEX idx_orgs_shortname ON organizations (shortname);
