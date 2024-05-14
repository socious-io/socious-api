CREATE TYPE dispute_state AS ENUM (
  'AWAITING_RESPONSE',
  'PENDING_REVIEW',
  'WITHDRAWN',
  'RESOLVED'
);

CREATE TYPE dispute_event_type AS ENUM ('MESSAGE', 'RESPONSE', 'WITHDRAW', 'VOTE');

CREATE TYPE vote_side_type AS ENUM ('CLAIMANT', 'RESPONDENT');

CREATE TABLE disputes (
  id uuid NOT NULL DEFAULT public.uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
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
  evidences uuid [] NOT NULL DEFAULT '{}',
  vote_side vote_side_type DEFAULT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE CASCADE,
  CONSTRAINT fk_dispute FOREIGN KEY (dispute_id) REFERENCES disputes(id) ON DELETE CASCADE
);
