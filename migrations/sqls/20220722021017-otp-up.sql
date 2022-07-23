
CREATE TYPE otp_type AS ENUM ('EMAIL', 'PHONE');

CREATE TABLE IF NOT EXISTS public.otps(
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  code int UNIQUE NOT NULL,
  user_id uuid,
  type otp_type NOT NULL,
  verified_at timestamp,
  expired_at timestamp with time zone DEFAULT now() + INTERVAL '6 minute' NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_user
    FOREIGN KEY(user_id) 
	    REFERENCES users(id)
)
