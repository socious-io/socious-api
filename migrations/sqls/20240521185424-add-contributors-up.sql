--Enum Types
CREATE TYPE contribute_invitation_status_type AS ENUM (
  'INVITED',
  'ACCEPTED',
  'DECLINED',
  'EXPIRED'
);

ALTER TYPE dispute_event_type RENAME TO dispute_event_type_old;
CREATE TYPE dispute_event_type AS ENUM ('MESSAGE', 'RESPONSE', 'WITHDRAW');

ALTER TYPE dispute_state RENAME TO dispute_state_old;
CREATE TYPE dispute_state AS ENUM (
  'AWAITING_RESPONSE',
  'DECISION_SUBMITTED',
  'PENDING_REVIEW',
  'WITHDRAWN',
  'CLOSED'
);

--Tables
CREATE TABLE dispute_contributor_invitations (
  id uuid NOT NULL DEFAULT public.uuid_generate_v4() PRIMARY KEY,
  status contribute_invitation_status_type NOT NULL DEFAULT 'INVITED',
  dispute_id uuid NOT NULL,
  contributor_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT fk_dispute FOREIGN KEY (dispute_id) REFERENCES disputes(id) ON DELETE CASCADE,
  CONSTRAINT fk_contributor FOREIGN KEY (contributor_id) REFERENCES identities(id) ON DELETE CASCADE
);

CREATE TABLE dispute_jourors (
  id uuid NOT NULL DEFAULT public.uuid_generate_v4() PRIMARY KEY,
  dispute_id uuid NOT NULL,
  juror_id uuid NOT NULL,
  vote_side vote_side_type DEFAULT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(dispute_id, juror_id),
  CONSTRAINT fk_dispute FOREIGN KEY (dispute_id) REFERENCES disputes(id) ON DELETE CASCADE,
  CONSTRAINT fk_juror FOREIGN KEY (juror_id) REFERENCES identities(id) ON DELETE CASCADE
);

ALTER TABLE users ADD COLUMN is_contributor boolean DEFAULT false;
ALTER TABLE dispute_events DROP COLUMN vote_side;

ALTER TABLE disputes
  ALTER COLUMN state DROP DEFAULT,
  ALTER COLUMN state TYPE dispute_state USING state::text::dispute_state,
  ALTER COLUMN state SET DEFAULT 'AWAITING_RESPONSE';

ALTER TABLE dispute_events
  ALTER COLUMN type DROP DEFAULT,
  ALTER COLUMN type TYPE dispute_event_type USING type::text::dispute_event_type,
  ALTER COLUMN type SET DEFAULT 'MESSAGE';

--Notification Types
ALTER TYPE notification_type
ADD
  VALUE 'CONTRIBUTION_INVITE';

--Indexes
