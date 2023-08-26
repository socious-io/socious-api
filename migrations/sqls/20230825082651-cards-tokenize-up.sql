/* Replace with your SQL commands */

ALTER TABLE cards 
  DROP COLUMN numbers,
  DROP COLUMN exp_month, 
  DROP COLUMN exp_year,
  DROP COLUMN cvc;

ALTER TABLE cards 
  ADD COLUMN meta jsonb,
  ADD COLUMN customer TEXT,
  ADD COLUMN jp_customer TEXT;

  