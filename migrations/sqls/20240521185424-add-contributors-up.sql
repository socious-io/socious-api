--Enum Types
CREATE TYPE contribute_invitation_status_type AS ENUM (
  'INVITED',
  'ACCEPTED',
  'DECLINED',
  'EXPIRED'
);

CREATE TYPE contribute_invitation_type AS ENUM (
  'DISPUTE'
);

--Tables
CREATE TABLE contributors (
  id uuid NOT NULL DEFAULT public.uuid_generate_v4() PRIMARY KEY,
  contributor_id uuid UNIQUE NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT fk_contributor FOREIGN KEY (contributor_id) REFERENCES identities(id) ON DELETE CASCADE
);

CREATE TABLE contribute_invitations (
  id uuid NOT NULL DEFAULT public.uuid_generate_v4() PRIMARY KEY,
  status contribute_invitation_status_type NOT NULL DEFAULT 'INVITED',
  type contribute_invitation_type NOT NULL,
  refrence_id uuid NOT NULL,
  contributor_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT fk_contributor FOREIGN KEY (contributor_id) REFERENCES identities(id) ON DELETE CASCADE
);

CREATE TABLE dispute_jourors (
  id uuid NOT NULL DEFAULT public.uuid_generate_v4() PRIMARY KEY,
  dispute_id uuid UNIQUE NOT NULL,
  juror_id uuid UNIQUE NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT fk_dispute FOREIGN KEY (dispute_id) REFERENCES disputes(id) ON DELETE CASCADE,
  CONSTRAINT fk_juror FOREIGN KEY (juror_id) REFERENCES identities(id) ON DELETE CASCADE
);

--Notification Types
ALTER TYPE notification_type
ADD
  VALUE 'CONTRIBUTION_INVITE';

--Indexes
