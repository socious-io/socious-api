CREATE TYPE notification_type as ENUM (
  'FOLLOWED', 'COMMENT_LIKE', 'POST_LIKE', 'CHAT', 'SHARE_POST', 'SHARE_PROJECT', 'COMMENT', 'APPLICATION'
);


CREATE TABLE notifications(
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  type notification_type NOT NULL,
  ref_id uuid NOT NULL,
  user_id uuid NOT NULL,
  data jsonb,
  view_at timestamp,
  read_at timestamp,
  updated_at timestamp,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE notifications_settings(
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  types notification_type[] DEFAULT '{FOLLOWED,COMMENT_LIKE,POST_LIKE,CHAT,SHARE_POST,SHARE_PROJECT,COMMENT,APPLICATION}',
  user_id uuid NOT NULL,
  updated_at timestamp,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
