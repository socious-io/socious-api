CREATE TYPE organization_type AS ENUM (
  'SOCIAL','NONPROFIT', 'COOP', 'IIF', 'PUBLIC', 'INTERGOV', 'DEPARTMENT', 'OTHER'
);

CREATE TABLE IF NOT EXISTS public.organizations (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  name varchar(255),
  bio text,
  description text,
  email varchar(255) UNIQUE NOT NULL,
  phone varchar(255) UNIQUE,
  country varchar(255),
  city varchar(255),
  type organization_type DEFAULT 'OTHER',
  address text,
  website varchar(255),
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);
