ALTER TABLE users DROP CONSTRAINT users_phone_key;


CREATE INDEX user_phone_idx ON users (phone, mobile_country_code); 
