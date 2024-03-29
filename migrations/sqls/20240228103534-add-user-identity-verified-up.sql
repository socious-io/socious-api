ALTER TABLE users ADD COLUMN identity_verified boolean DEFAULT false;

CREATE TABLE IF NOT EXISTS referrings (
  referred_identity_id uuid PRIMARY KEY NOT NULL REFERENCES identities(id),
  referred_by_id uuid NOT NULL REFERENCES identities(id),
  created_at timestamptz DEFAULT now() NOT NULL
);
