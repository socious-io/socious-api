ALTER TYPE organization_type ADD VALUE 'STARTUP';
CREATE TYPE org_size AS ENUM ('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I');
ALTER TABLE organizations ADD COLUMN size org_size;
