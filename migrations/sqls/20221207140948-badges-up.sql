ALTER TYPE social_causes_type 
    ADD VALUE 'ABORTION'
    ADD VALUE 'EUTHANASIA',
    ADD VALUE 'NEURODIVERSITY',
    ADD VALUE 'SUSTAINABLE_COMMUNITIES',
    ADD VALUE 'BIODIVERSITY_LIFE_BELOW_WATER',
    ADD VALUE 'PEACE_JUSTICE',
    ADD VALUE 'COLLABORATION_FOR_IMPACT',
    ADD VALUE 'INNOVATION';


CREATE TYPE social_causes_categories_type AS ENUM (
  'PEOPLE_RELATED',
  'ANIMAL_RELATED',
  'COMMUNITIES_RELATED',
  'PLANET_RELATED'
);

CREATE TYPE sdg_type AS ENUM (
  'HEALTH',
  'LIFE',
  'REDUCED_INEQUALITIES',
  'PEACE_JUSTICE',
  'SUSTAINABLE_CITIES_COMMUNITIES',
  'GENDER_EQUALITY',
  'CLIMATE_ACTION',
  'NO_POVERTY',
  'LIFE_BELOW_WATER',
  'GOALS_PARTNERSHIPS',
  'ZERO_HUNGER',
  'EDUCATION_QUALITY',
  'CLEAN_WATER_SANITATION',
  'ENERGY',
  'ECONOMIC_GROWTH',
  'INDUSTRY_INNOVATION_INFRASTRUCTURE',
  'RESPONSIBLE_CONSUMPTION_PRODUCTION'
)
