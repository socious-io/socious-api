DELETE FROM
  disputes;

ALTER TABLE
  disputes
ADD
  COLUMN mission_id uuid NOT NULL CONSTRAINT fk_mission REFERENCES missions(id) ON DELETE CASCADE;
