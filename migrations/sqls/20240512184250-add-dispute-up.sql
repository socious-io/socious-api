--Enum Types
CREATE TYPE dispute_state AS ENUM (
  'AWAITING_RESPONSE',
  'PENDING_REVIEW',
  'WITHDRAWN',
  'RESOLVED'
);

CREATE TYPE dispute_event_type AS ENUM ('MESSAGE', 'RESPONSE', 'WITHDRAW', 'VOTE');

CREATE TYPE vote_side_type AS ENUM ('CLAIMANT', 'RESPONDENT');

--Sequences
CREATE SEQUENCE dispute_code START 1;

--Tables
CREATE TABLE disputes (
  id uuid NOT NULL DEFAULT public.uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  code text NOT NULL DEFAULT CONCAT('DIS-', nextval('dispute_code')),
  claimant_id uuid NOT NULL,
  respondent_id uuid NOT NULL,
  state dispute_state NOT NULL DEFAULT 'AWAITING_RESPONSE',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT fk_claimant FOREIGN KEY (claimant_id) REFERENCES identities(id) ON DELETE CASCADE,
  CONSTRAINT fk_respondent FOREIGN KEY (respondent_id) REFERENCES identities(id) ON DELETE CASCADE
);

CREATE TABLE dispute_events (
  id uuid NOT NULL DEFAULT public.uuid_generate_v4() PRIMARY KEY,
  message text,
  type dispute_event_type NOT NULL DEFAULT 'MESSAGE',
  dispute_id uuid NOT NULL,
  identity_id uuid NOT NULL,
  vote_side vote_side_type DEFAULT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE CASCADE,
  CONSTRAINT fk_dispute FOREIGN KEY (dispute_id) REFERENCES disputes(id) ON DELETE CASCADE
);

CREATE TABLE dispute_evidences (
  id uuid NOT NULL DEFAULT public.uuid_generate_v4() PRIMARY KEY,
  identity_id uuid NOT NULL,
  dispute_id uuid NOT NULL,
  dispute_event_id uuid NOT NULL,
  media_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE CASCADE,
  CONSTRAINT fk_dispute FOREIGN KEY (dispute_id) REFERENCES disputes(id) ON DELETE CASCADE,
  CONSTRAINT fk_dispute_event FOREIGN KEY (dispute_event_id) REFERENCES dispute_events(id) ON DELETE CASCADE,
  CONSTRAINT fk_media FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE
);

--Notification Types
ALTER TYPE notification_type
ADD
  VALUE 'DISPUTE_INITIATED';

ALTER TYPE notification_type
ADD
  VALUE 'DISPUTE_NEW_RESPONSE';

ALTER TYPE notification_type
ADD
  VALUE 'DISPUTE_NEW_MESSAGE';

ALTER TYPE notification_type
ADD
  VALUE 'DISPUTE_WITHDRAWN';

-- Indexes
CREATE UNIQUE INDEX idx_disputes ON disputes(claimant_id, respondent_id);

CREATE UNIQUE INDEX idx_dispute_events ON chats_participants(dispute_id, created_at);

CREATE UNIQUE INDEX idx_dispute_evidences ON dispute_evidences(dispute_event_id);
