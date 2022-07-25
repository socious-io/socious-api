
ALTER TABLE public.users
  DROP COLUMN name,
  DROP COLUMN city_ja,
  DROP COLUMN description_search_ja;

ALTER TABLE public.users
  RENAME COLUMN address_detail TO address;


ALTER TABLE public.users
  ADD COLUMN last_name varchar(70) DEFAULT NULL;

ALTER TABLE public.users
  ADD COLUMN password_expired boolean DEFAULT false;


ALTER TABLE public.users 
  ADD CONSTRAINT users_phone_key unique (phone) ;
