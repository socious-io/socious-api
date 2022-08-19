ALTER TABLE users ADD COLUMN country varchar(3);
ALTER TABLE organizations DROP COLUMN country;
ALTER TABLE organizations ADD COLUMN country varchar(3);
