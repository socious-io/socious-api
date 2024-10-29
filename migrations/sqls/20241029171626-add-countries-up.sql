CREATE TABLE countries (
  id int NOT NULL PRIMARY KEY,
  code varchar(2),
  code_iso3 varchar(3),
  code_isonumeric varchar(3),
  fips varchar(2),
  country text,
  capital text,
  area_km int,
  population int,
  continent varchar(2),
  tld varchar(2),
  currency_code varchar(3),
  currency_name text,
  phone: varchar(3),
  postal_code_format: text,
  postal_code_regex: text,
  languages text[],
  neighbours: varchar(2)[],
  equivalent_fips_code: varchar(2)
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
