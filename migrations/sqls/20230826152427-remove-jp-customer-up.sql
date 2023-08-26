ALTER TABLE cards DROP COLUMN jp_customer;
ALTER TABLE cards ADD COLUMN is_jp boolean default false;
