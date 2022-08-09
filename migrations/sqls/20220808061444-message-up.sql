CREATE TYPE chat_type as ENUM (
  'CHAT', 'GROUPED', 'CHANNEL'
);

CREATE TYPE chat_member_type as ENUM (
  'MEMBER', 'ADMIN'
);

CREATE TABLE chats(
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  name text NOT NULL,
  description text,
  type chat_type NOT NULL DEFAULT 'CHAT',
  created_by uuid NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp
);

CREATE TABLE chats_participants(
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  identity_id uuid NOT NULL,
  chat_id uuid NOT NULL,
  type chat_member_type DEFAULT 'MEMBER',
  muted_until timestamp,
  joined_by uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE CASCADE,
  CONSTRAINT fk_chat FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
  CONSTRAINT fk_joined_by_identity FOREIGN KEY (joined_by) REFERENCES identities(id) ON DELETE NO ACTION
);

CREATE UNIQUE INDEX idx_identity_chat ON chats_participants(identity_id, chat_id);

CREATE TABLE messages(
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  reply_id uuid,
  chat_id uuid NOT NULL,
  identity_id uuid NOT NULL,
  text text,
  replied boolean DEFAULT false,
  read_at timestamp,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp,
  CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE CASCADE,
  CONSTRAINT fk_chat FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE
);


CREATE OR REPLACE FUNCTION replied()
  RETURNS TRIGGER AS
$$
BEGIN
  
  IF NEW.reply_id IS NOT NULL THEN
    UPDATE messages SET replied=true WHERE id=NEW.reply_id;
  END IF;

  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;


CREATE TRIGGER new_message
    BEFORE INSERT ON messages FOR EACH ROW EXECUTE FUNCTION replied();
