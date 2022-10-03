ALTER TYPE social_causes_type RENAME TO social_causes_type_old;

CREATE TYPE social_causes_type AS ENUM (
  'SOCIAL',
  'POVERTY',
  'HOMELESSNESS',
  'HUNGER',
  'HEALTH',
  'SUBSTANCE_ABUSE',
  'MENTAL',
  'BULLYING',
  'SECURITY',
  'EDUCATION',
  'GENDER_EQUALITY',
  'GENDER_BASED_VIOLENCE',
  'SEXUAL_VIOLENCE',
  'DOMESTIC_VIOLENCE',
  'WATER_SANITATION',
  'SUSTAINABLE_ENERGY',
  'DECENT_WORK',
  'INEQUALITY',
  'MINORITY',
  'MULTICULTURALISM',
  'DIVERSITY_INCLUSION',
  'INDIGENOUS_PEOPLES',
  'DISABILITY',
  'LGBTQI',
  'REFUGEE',
  'MIGRANTS',
  'ORPHANS',
  'CHILD_PROTECTION',
  'COMMUNITY_DEVELOPMENT',
  'DEPOPULATION',
  'OVERPOPULATION',
  'HUMAN_RIGHTS',
  'SUSTAINABILITY',
  'RESPONSIBLE_CONSUMPTION',
  'CLIMATE_CHANGE',
  'NATURAL_DISASTERS',
  'BIODIVERSITY',
  'ANIMAL_RIGHTS',
  'ARMED_CONFLICT',
  'PEACEBUILDING',
  'DEMOCRACY',
  'CIVIC_ENGAGEMENT',
  'JUSTICE',
  'GOVERNANCE',
  'CRIME_PREVENTION',
  'CORRUPTION',
  'OTHER',
  'RURAL_DEVELOPMENT',
  'VEGANISM',
  'BLACK_LIVES_MATTER',
  'ISLAMOPHOBIA',
  'ANTI_SEMITISM'
);

UPDATE users SET social_causes=array_replace(social_causes, 'LGBTQI+', 'LGBTQI');
UPDATE organizations SET social_causes=array_replace(social_causes, 'LGBTQI+', 'LGBTQI');
UPDATE posts SET causes_tags=array_replace(causes_tags, 'LGBTQI+', 'LGBTQI');
UPDATE projects SET causes_tags=array_replace(causes_tags, 'LGBTQI+', 'LGBTQI');

ALTER TABLE users ALTER COLUMN social_causes TYPE social_causes_type[] USING social_causes::text::social_causes_type[];
ALTER TABLE organizations ALTER COLUMN social_causes TYPE social_causes_type[] USING social_causes::text::social_causes_type[];
ALTER TABLE posts ALTER COLUMN causes_tags TYPE social_causes_type[] USING causes_tags::text::social_causes_type[];
ALTER TABLE projects ALTER COLUMN causes_tags TYPE social_causes_type[] USING causes_tags::text::social_causes_type[];

DROP TYPE social_causes_type_old;
