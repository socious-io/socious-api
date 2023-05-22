DELETE FROM
    devices d1
USING devices d2
WHERE
    d1.id <> d2.id AND 
    d1.token = d2.token;


DROP INDEX idx_user_token;

CREATE UNIQUE INDEX idx_device_tokens ON devices (token);
