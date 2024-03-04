ALTER TABLE organizations ADD COLUMN did text;

CREATE TYPE experience_credentials_status AS ENUM ('PENDING', 'APPROVED', 'SENT', 'CLAIMED');

CREATE TABLE experience_credentials (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  status experience_credentials_status DEFAULT 'PENDING' NOT NULL,
  user_id uuid NOT NULL,
  org_id uuid NOT NULL,
  experience_id uuid UNIQUE NOT NULL,
  connection_id text,
  connection_url text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_org FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_experience FOREIGN KEY (experience_id) REFERENCES experiences(id) ON DELETE CASCADE
);
