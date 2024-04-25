CREATE TABLE educations (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  user_id uuid NOT NULL,
  org_id uuid NOT NULL,
  title text,
  description text,
  grade text,
  degree text,
  start_at timestamp NOT NULL,
  end_at timestamp,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_org FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TYPE educations_credentials_status AS ENUM ('PENDING', 'APPROVED', 'SENT', 'CLAIMED', 'ISSUED', 'REJECTED');



CREATE TABLE educations_credentials (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  status educations_credentials_status DEFAULT 'PENDING' NOT NULL,
  user_id uuid NOT NULL,
  org_id uuid NOT NULL,
  education_id uuid UNIQUE NOT NULL,
  message text,
  connection_id text,
  connection_url text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_org FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_education FOREIGN KEY (education_id) REFERENCES educations(id) ON DELETE CASCADE
);
