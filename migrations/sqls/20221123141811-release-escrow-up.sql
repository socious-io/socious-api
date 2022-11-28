ALTER TABLE escrows 
  ADD COLUMN mission_id uuid,
  ADD COLUMN offer_id uuid NOT NULL;

ALTER TABLE escrows 
  ADD CONSTRAINT fk_mission FOREIGN KEY (mission_id) REFERENCES missions(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_offer FOREIGN KEY (offer_id) REFERENCES offers(id) ON DELETE SET NULL;
