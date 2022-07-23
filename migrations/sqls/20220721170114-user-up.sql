CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_status AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPEND');

CREATE TABLE IF NOT EXISTS public.users(
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  first_name varchar(70) DEFAULT NULL,
  username varchar(200) UNIQUE NOT NULL,
  name varchar(255) DEFAULT NULL,
  email varchar(200) UNIQUE NOT NULL,
  email_text varchar(255) DEFAULT NULL,
  mobile_countries_id int DEFAULT NULL,
  phone varchar(255) DEFAULT NULL,
  wallet_address varchar(255) DEFAULT NULL,
  password text NOT NULL,
  remember_token text DEFAULT NULL,
  city text,
  city_ja text,
  description_search text,
  description_search_ja text,
  address_detail text,
  avatar text,
  cover_image text,
  expiry_date timestamp,
  status user_status DEFAULT 'INACTIVE' NOT NULL,
  mission text,
  bio text,
  profile_id varchar(200) DEFAULT NULL,
  view_as int DEFAULT NULL,
  language varchar(255) DEFAULT NULL,
  my_conversation varchar(255) DEFAULT NULL,  
  email_verified_at timestamp DEFAULT NULL,
  phone_verified_at timestamp DEFAULT NULL,
  impact_score double precision NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp
);
