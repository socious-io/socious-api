UPDATE organizations SET shortname=split_part(id::text, '-', 5) WHERE shortname IS NULL;

ALTER TABLE organizations ALTER COLUMN shortname SET NOT NULL;
