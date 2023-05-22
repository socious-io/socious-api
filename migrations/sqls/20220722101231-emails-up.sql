CREATE TABLE public.emails(
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  message_id varchar(255) UNIQUE NOT NULL,
  options jsonb,
  info jsonb,
  created_at timestamp with time zone DEFAULT now() NOT NULL
)
