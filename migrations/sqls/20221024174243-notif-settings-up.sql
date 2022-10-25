DROP TABLE notifications_settings;

ALTER TYPE notification_type ADD VALUE 'OFFER';
ALTER TYPE notification_type ADD VALUE 'REJECT';
ALTER TYPE notification_type ADD VALUE 'APPROVED';
ALTER TYPE notification_type ADD VALUE 'HIRED';
ALTER TYPE notification_type ADD VALUE 'PROJECT_COMPLETE';
ALTER TYPE notification_type  ADD VALUE 'EMPLOYEE_CANCELED';
ALTER TYPE notification_type  ADD VALUE 'EMPLOYER_CANCELED';
ALTER TYPE notification_type ADD VALUE 'EMPLOYER_CONFIRMED';


CREATE TABLE IF NOT EXISTS notifications_settings(
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  user_id uuid NOT NULL,
  type notification_type NOT NULL,
  email boolean DEFAULT true,
  in_app boolean DEFAULT true,
  push boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);


CREATE UNIQUE INDEX idx_notif_settings ON notifications_settings (user_id, type);
