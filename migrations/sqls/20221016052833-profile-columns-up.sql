CREATE TYPE language_level AS ENUM ('BASIC', 'CONVERSANT', 'PROFICIENT', 'FLUENT', 'NATIVE');

CREATE TABLE experiences (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  user_id uuid NOT NULL,
  org_id uuid NOT NULL,
  title text,
  description text,
  skills text[],
  start_at timestamp NOT NULL,
  end_at timestamp,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_org FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE languages (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  name varchar(64) NOT NULL,
  level language_level,
  user_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


ALTER TABLE users
  ADD COLUMN certificates text[],
  ADD COLUMN golas text,
  ADD COLUMN educations text[];
