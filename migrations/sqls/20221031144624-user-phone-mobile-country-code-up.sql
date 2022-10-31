DROP INDEX user_phone_idx;


UPDATE users u1 
  SET phone=NULL,mobile_country_code=NULL
FROM users u2 
WHERE 
  u1.phone=u2.phone AND 
  u1.mobile_country_code=u2.mobile_country_code AND
  u1.id <> u2.id;


CREATE UNIQUE INDEX idx_phone_country_code ON users (phone, mobile_country_code);
