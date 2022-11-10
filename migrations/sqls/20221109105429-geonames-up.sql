CREATE TABLE geonames (
  id INTEGER PRIMARY KEY NOT NULL,
  name VARCHAR(200) NOT NULL,
  asciiname VARCHAR(200) NOT NULL,
  latlong POINT,
  feature_class CHAR(1),
  feature_code VARCHAR(10),
  country_code CHAR(2),
  cc2 CHAR(2)[],
  admin1_code VARCHAR(20),
  timezone VARCHAR(40),
  population INTEGER,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at DATE DEFAULT now() NOT NULL
);

CREATE TABLE geonames_alt (
  id INTEGER PRIMARY KEY NOT NULL,
  geoname_id INTEGER NOT NULL,
  iso_language VARCHAR(7),
  alternate_name VARCHAR(400),
  is_preferred_name BOOLEAN,
  is_short_name BOOLEAN,
  is_colloquial BOOLEAN,
  is_historic BOOLEAN,
  -- from and to column are not documented and not present in today's version, so I have no idea the format
  -- if we care about them later, we can add them in a future migration
  -- from ,
  -- to ,
  CONSTRAINT fk_geoname FOREIGN KEY (geoname_id) REFERENCES geonames(id) ON DELETE CASCADE
);
