ALTER TABLE referrings 
  DROP CONSTRAINT referrings_referred_by_id_fkey,
  DROP CONSTRAINT referrings_referred_identity_id_fkey;


ALTER TABLE referrings 
  ADD CONSTRAINT referrings_referred_by_id_fkey 
    FOREIGN KEY (referred_by_id) REFERENCES identities(id) ON DELETE CASCADE,
  ADD CONSTRAINT referrings_referred_identity_id_fkey
    FOREIGN KEY (referred_identity_id) REFERENCES identities(id) ON DELETE CASCADE;
