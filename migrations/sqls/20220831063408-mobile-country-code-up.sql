ALTER TABLE users DROP COLUMN mobile_countries_id;

ALTER TABLE users ADD COLUMN mobile_country_code varchar(16);
ALTER TABLE organizations ADD COLUMN mobile_country_code varchar(16);
