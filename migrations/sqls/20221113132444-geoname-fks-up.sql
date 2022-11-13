ALTER TABLE users ADD COLUMN geoname_id INTEGER;
ALTER TABLE users ADD CONSTRAINT fk_geoname FOREIGN KEY (geoname_id) REFERENCES geonames(id) ON DELETE CASCADE;
ALTER TABLE organizations ADD COLUMN geoname_id INTEGER;
ALTER TABLE organizations ADD CONSTRAINT fk_geoname FOREIGN KEY (geoname_id) REFERENCES geonames(id) ON DELETE CASCADE;
ALTER TABLE projects ADD COLUMN geoname_id INTEGER;
ALTER TABLE projects ADD CONSTRAINT fk_geoname FOREIGN KEY (geoname_id) REFERENCES geonames(id) ON DELETE CASCADE;
