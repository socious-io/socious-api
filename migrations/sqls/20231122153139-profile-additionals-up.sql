CREATE TYPE additional_type AS ENUM (
  'PORTFOLIO', 'CERTIFICATE', 'EDUCATION', 'BENEFIT', 'RECOMMENDATIONS'
);


CREATE TABLE additionals (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  type additional_type NOT NULL,
  title text,
  description text,
  url text,
  image uuid,
  sub_image uuid,
  identity_id uuid NOT NULL,
  ref_identity_id uuid,
  meta jsonb,
  enabled boolean DEFAULT true,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  
  CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE CASCADE,
  CONSTRAINT fk_ref_identity FOREIGN KEY (ref_identity_id) REFERENCES identities(id) ON DELETE CASCADE,
  CONSTRAINT fk_media_image FOREIGN KEY (image) REFERENCES media(id) ON DELETE SET NULL,
  CONSTRAINT fk_media_sub_image FOREIGN KEY (sub_image) REFERENCES media(id) ON DELETE SET NULL
)
