CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

---------
--- Types
---------

CREATE TYPE user_status AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPEND');
CREATE TYPE otp_type AS ENUM ('EMAIL', 'PHONE');
CREATE TYPE otp_purpose AS ENUM ('AUTH', 'FORGET_PASSWORD', 'ACTIVATION');
CREATE TYPE organization_type AS ENUM ('SOCIAL','NONPROFIT', 'COOP', 'IIF', 'PUBLIC', 'INTERGOV', 'DEPARTMENT', 'OTHER');
CREATE TYPE identity_type AS ENUM ('users', 'organizations');
CREATE TYPE project_type AS ENUM ('ONE_OFF', 'PART_TIME', 'FULL_TIME');
CREATE TYPE project_length AS ENUM ('LESS_THAN_A_DAY', 'LESS_THAN_A_MONTH', '1_3_MONTHS', '3_6_MONTHS', '6_MONTHS_OR_MORE');
CREATE TYPE notification_type as ENUM ('FOLLOWED', 'COMMENT_LIKE', 'POST_LIKE', 'CHAT', 'SHARE_POST', 'SHARE_PROJECT', 'COMMENT', 'APPLICATION');
CREATE TYPE chat_type as ENUM ('CHAT', 'GROUPED', 'CHANNEL');
CREATE TYPE chat_member_type as ENUM ('MEMBER', 'ADMIN');
CREATE TYPE applicants_status_type AS ENUM ('PENDING', 'OFFERED', 'REJECTED', 'WITHDRAWN', 'APPROVED', 'HIRED');
CREATE TYPE payment_type AS ENUM ('VOLUNTEER', 'PAID');
CREATE TYPE payment_scheme AS ENUM ('HOURLY', 'FIXED');
CREATE TYPE project_status AS ENUM ('DRAFT', 'EXPIRE', 'ACTIVE');
CREATE TYPE project_remote_preference_type AS ENUM ('ONSITE', 'REMOOTE', 'HYBRID');
CREATE TYPE token_type AS ENUM ('JWT_ACCESS', 'JWT_REFRESH');
CREATE TYPE org_status AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPEND');
CREATE TYPE project_remote_preference_type AS ENUM ('ONSITE', 'REMOTE', 'HYBRID');
CREATE TYPE payment_service AS ENUM ('STRIPE');
CREATE TYPE payment_currency AS ENUM ('USD', 'RWF', 'AUD','BDT','GTQ','INR','CHF','MXN','CAD','DOP','KRW','EUR','ZAR','NPR','COP','UYU','CRC','JPY','GBP','ARS','GHS','PEN','DKK','BRL','CLP', 'EGP', 'THB');
CREATE TYPE topup_status AS ENUM ('WAITING', 'COMPLETE');
CREATE TYPE employee_status AS ENUM ('ACTIVE', 'COMPLETE', 'CONFIRMED', 'CANCELED', 'KICKED_OUT');
CREATE TYPE language_level AS ENUM ('BASIC', 'CONVERSANT', 'PROFICIENT', 'FLUENT', 'NATIVE');
CREATE TYPE offers_status_type AS ENUM ('PENDING', 'WITHDRAWN', 'APPROVED', 'HIRED', 'CLOSED', 'CANCELED');
CREATE TYPE mission_status AS ENUM ('ACTIVE', 'COMPLETE', 'CONFIRMED', 'CANCELED', 'KICKED_OUT');
CREATE TYPE connect_status AS ENUM ('PENDING', 'CONNECTED', 'BLOCKED');
CREATE TYPE email_service_type AS ENUM ('SMTP', 'SENDGRID', 'TEST');
CREATE TYPE payment_source_type AS ENUM ('CARD');
CREATE TYPE oauth_connected_providers AS ENUM ('STRIPE');
CREATE TYPE webhook_party_type AS ENUM ('PROOFSPACE');
CREATE TYPE payment_mode_type AS ENUM ('CRYPTO', 'FIAT');
CREATE TYPE collector_jobs_services AS ENUM ('IDEALIST', 'RELIEFWEB');
CREATE TYPE org_size AS ENUM ('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I');
CREATE TYPE additional_type AS ENUM ('PORTFOLIO', 'CERTIFICATE', 'EDUCATION', 'BENEFIT', 'RECOMMENDATIONS');
CREATE TYPE employment_type AS ENUM ('ONE_OFF', 'PART_TIME', 'FULL_TIME');
CREATE TYPE experience_credentials_status AS ENUM ('PENDING', 'APPROVED', 'SENT', 'CLAIMED');
CREATE TYPE verification_credentials_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE educations_credentials_status AS ENUM ('PENDING', 'APPROVED', 'SENT', 'CLAIMED', 'ISSUED', 'REJECTED');
CREATE TYPE submit_works_status_type AS ENUM ('PENDING','CONFIRMED');
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
  'LGBTQI+',
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
);


----------
--- Tables
----------

CREATE TABLE IF NOT EXISTS public.users(
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  first_name varchar(70) DEFAULT NULL,
  last_name varchar(70) DEFAULT NULL,
  username varchar(200) UNIQUE NOT NULL,
  email varchar(200) UNIQUE NOT NULL,
  email_text varchar(255) DEFAULT NULL,
  mobile_countries_id int DEFAULT NULL,
  phone varchar(255) DEFAULT NULL,
  wallet_address varchar(255) DEFAULT NULL,
  password text NOT NULL,
  password_expired boolean DEFAULT false,
  remember_token text DEFAULT NULL,
  city text,
  description_search text,
  address text,
  avatar text,
  cover_image text,
  expiry_date timestamp,
  status user_status DEFAULT 'INACTIVE' NOT NULL,
  mission text,
  bio text,
  profile_id varchar(200) DEFAULT NULL,
  view_as int DEFAULT NULL,
  language varchar(255) DEFAULT NULL,
  my_conversation varchar(255) DEFAULT NULL,  
  email_verified_at timestamp DEFAULT NULL,
  phone_verified_at timestamp DEFAULT NULL,
  impact_score double precision NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp,
  CONSTRAINT users_phone_key unique (phone)
);

CREATE TABLE IF NOT EXISTS public.otps(
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  code int NOT NULL,
  user_id uuid,
  type otp_type NOT NULL,
  purpose otp_purpose NOT NULL DEFAULT 'AUTH',
  verified_at timestamp,
  expired_at timestamp with time zone DEFAULT now() + INTERVAL '6 minute' NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_otp_code_user ON public.otps(user_id, code);

CREATE TABLE public.emails(
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  message_id varchar(255) UNIQUE NOT NULL,
  options jsonb,
  info jsonb,
  created_at timestamp with time zone DEFAULT now() NOT NULL
)

CREATE TABLE IF NOT EXISTS public.deleted_users (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  user_id uuid NOT NULL,
  username varchar(200),
  reason text,
  registered_at timestamp NOT NULL,
  deleted_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.organizations (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  name varchar(255),
  bio text,
  description text,
  email varchar(255) UNIQUE NOT NULL,
  phone varchar(255) UNIQUE,
  country varchar(255),
  city varchar(255),
  type organization_type DEFAULT 'OTHER',
  address text,
  website varchar(255),
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.org_members (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  user_id uuid NOT NULL,
  org_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_org FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.identities (
  id uuid PRIMARY KEY NOT NULL,
  type identity_type NOT NULL,
  meta jsonb,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);


CREATE OR REPLACE FUNCTION set_users_identity()
  RETURNS TRIGGER AS
$$
DECLARE meta_data JSON;
BEGIN
  meta_data := (SELECT row_to_json(t) FROM (SELECT id, username, email, (NEW.first_name || ' ' || NEW.last_name) as name FROM users) t WHERE id = NEW.id);
    
  INSERT INTO identities (id, type, meta)  VALUES (NEW.id, 'users', meta_data) ON CONFLICT (id) DO UPDATE SET meta=meta_data;
  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION set_orgs_identity()
  RETURNS TRIGGER AS
$$
DECLARE meta_data JSON;
BEGIN
  meta_data := (SELECT row_to_json(t) FROM (SELECT id, name, email FROM organizations) t WHERE id = NEW.id);
    
  INSERT INTO identities (id, type, meta)  VALUES (NEW.id, 'organizations', meta_data) ON CONFLICT (id) DO UPDATE SET meta=meta_data;
  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION delete_identity() 
RETURNS TRIGGER AS
$$
BEGIN
  DELETE FROM identities WHERE id=OLD.id;
  RETURN OLD;
END;
$$
LANGUAGE PLPGSQL;


CREATE TRIGGER update_identity
    AFTER UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_users_identity();

CREATE TRIGGER insert_identity
    AFTER INSERT ON users FOR EACH ROW EXECUTE FUNCTION set_users_identity();

CREATE TRIGGER delete_identity
    BEFORE DELETE ON users FOR EACH ROW EXECUTE FUNCTION delete_identity();


CREATE TRIGGER update_identity
    AFTER UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION set_orgs_identity();

CREATE TRIGGER insert_identity
    AFTER INSERT ON organizations FOR EACH ROW EXECUTE FUNCTION set_orgs_identity();

CREATE TRIGGER delete_identity
    BEFORE DELETE ON organizations FOR EACH ROW EXECUTE FUNCTION delete_identity();
CREATE TABLE public.posts (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  content text,
  identity_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp,
  CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE CASCADE
)


ALTER TABLE users ADD COLUMN social_causes social_causes_type[];
ALTER TABLE organizations ADD COLUMN social_causes social_causes_type[];

ALTER TABLE posts 
  ADD COLUMN causes_tags social_causes_type[],
  ADD COLUMN hashtags text[],
  ADD COLUMN identity_tags uuid[];
CREATE TABLE IF NOT EXISTS public.follows (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  follower_identity_id uuid NOT NULL,
  following_identity_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_follower_identity FOREIGN KEY (follower_identity_id) REFERENCES identities(id) ON DELETE CASCADE,
  CONSTRAINT fk_following_identity FOREIGN KEY (following_identity_id) REFERENCES identities(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX idx_followed ON follows (follower_identity_id, following_identity_id);


ALTER TABLE public.users
  ADD COLUMN followers int DEFAULT 0,
  ADD COLUMN followings int DEFAULT 0;

ALTER TABLE organizations
  ADD COLUMN followers int DEFAULT 0,
  ADD COLUMN followings int DEFAULT 0;


CREATE OR REPLACE FUNCTION followed()
  RETURNS TRIGGER AS
$$
BEGIN
  UPDATE users SET followers=followers+1 FROM identities i WHERE users.id=NEW.following_identity_id AND users.id=i.id AND i.type='users';
  UPDATE users SET followings=followings+1 FROM identities i WHERE users.id=NEW.follower_identity_id AND users.id=i.id AND i.type='users';
  UPDATE organizations SET followers=followers+1 FROM identities i WHERE organizations.id=NEW.following_identity_id AND organizations.id=i.id AND i.type='organizations';
  UPDATE organizations SET followings=followings+1 FROM identities i WHERE organizations.id=NEW.follower_identity_id AND organizations.id=i.id AND i.type='organizations';
  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION unfollowed()
  RETURNS TRIGGER AS
$$
BEGIN
  UPDATE users SET followers=followers-1 FROM identities i WHERE users.id=OLD.following_identity_id AND users.id=i.id AND i.type='users';
  UPDATE users SET followings=followings-1 FROM identities i WHERE users.id=OLD.follower_identity_id AND users.id=i.id AND i.type='users';
  UPDATE organizations SET followers=followers-1 FROM identities i WHERE organizations.id=OLD.following_identity_id AND organizations.id=i.id AND i.type='organizations';
  UPDATE organizations SET followings=followings-1 FROM identities i WHERE organizations.id=OLD.follower_identity_id AND organizations.id=i.id AND i.type='organizations';
  RETURN OLD;
END;
$$
LANGUAGE PLPGSQL;


CREATE TRIGGER new_follow
    AFTER INSERT ON follows FOR EACH ROW EXECUTE FUNCTION followed();

CREATE TRIGGER delete_follow
    BEFORE DELETE ON follows FOR EACH ROW EXECUTE FUNCTION unfollowed();


CREATE TABLE IF NOT EXISTS public.projects(
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  identity_id uuid NOT NULL,
  title varchar(200),
  description text,
  project_type project_type DEFAULT NULL,
  project_length project_length DEFAULT NULL,
  country_id int DEFAULT NULL,
  payment_type int,
  payment_scheme int,
  payment_currency varchar(200) DEFAULT NULL,
  payment_range_lower varchar(200) DEFAULT NULL,
  payment_range_higher varchar(200) DEFAULT NULL,
  experience_level int,
  project_status int,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp,
  CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE CASCADE
);



CREATE TABLE notifications(
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  type notification_type NOT NULL,
  ref_id uuid NOT NULL,
  user_id uuid NOT NULL,
  data jsonb,
  view_at timestamp,
  read_at timestamp,
  updated_at timestamp,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE notifications_settings(
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  types notification_type[] DEFAULT '{FOLLOWED,COMMENT_LIKE,POST_LIKE,CHAT,SHARE_POST,SHARE_PROJECT,COMMENT,APPLICATION}',
  user_id uuid NOT NULL,
  updated_at timestamp,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE chats(
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  name text NOT NULL,
  description text,
  type chat_type NOT NULL DEFAULT 'CHAT',
  created_by uuid NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp
);

CREATE TABLE chats_participants(
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  identity_id uuid NOT NULL,
  chat_id uuid NOT NULL,
  type chat_member_type DEFAULT 'MEMBER',
  muted_until timestamp,
  joined_by uuid NOT NULL,
  last_read_id uuid,
  all_read boolean DEFAULT false,
  last_read_at timestamp,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE CASCADE,
  CONSTRAINT fk_chat FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
  CONSTRAINT fk_joined_by_identity FOREIGN KEY (joined_by) REFERENCES identities(id) ON DELETE NO ACTION
);

CREATE UNIQUE INDEX idx_identity_chat ON chats_participants(identity_id, chat_id);

CREATE TABLE messages(
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  reply_id uuid,
  chat_id uuid NOT NULL,
  identity_id uuid NOT NULL,
  text text,
  replied boolean DEFAULT false,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp,
  CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE CASCADE,
  CONSTRAINT fk_chat FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE
);


CREATE OR REPLACE FUNCTION new_message()
  RETURNS TRIGGER AS
$$
BEGIN
  
  IF NEW.reply_id IS NOT NULL THEN
    UPDATE messages SET replied=true WHERE id=NEW.reply_id;
  END IF;

  UPDATE chats SET updated_at=now() WHERE id=NEW.chat_id;
  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;


CREATE TRIGGER new_message
    BEFORE INSERT ON messages FOR EACH ROW EXECUTE FUNCTION new_message();
CREATE TABLE public.applicants (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  identity_id uuid NOT NULL,
  project_id uuid NOT NULL,
  user_id uuid NOT NULL,
  cover_letter text,
  application_status int,
  payment_type int,
  payment_rate int,
  offer_rate varchar(255),
  offer_message varchar(255),
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp,
  CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE CASCADE,
  CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX idx_applied ON applicants (user_id, project_id);CREATE TABLE devices(
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  user_id uuid NOT NULL,
  token text NOT NULL,
  meta jsonb,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX idx_user_token ON devices (user_id, token);


ALTER TABLE applicants
  DROP CONSTRAINT fk_identity;

ALTER TABLE applicants 
  DROP COLUMN identity_id;

ALTER TABLE applicants 
  DROP COLUMN application_status,
  DROP COLUMN payment_type;

ALTER TABLE projects 
  DROP COLUMN project_status,
  DROP COLUMN payment_type,
  DROP COLUMN payment_scheme;

ALTER TABLE projects 
  ADD COLUMN status project_status,
  ADD COLUMN payment_type payment_type,
  ADD COLUMN payment_scheme payment_scheme DEFAULT 'FIXED';

ALTER TABLE applicants
  ADD COLUMN assignment_total int DEFAULT 0,
  ADD COLUMN due_date timestamp,
  Add COLUMN feedback text,
  ADD COLUMN status applicants_status_type DEFAULT 'PENDING',
  ADD COLUMN payment_type payment_type DEFAULT 'PAID';
CREATE TABLE media(
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  identity_id uuid NOT NULL,
  filename text,
  url text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE CASCADE
);


ALTER TABLE public.users 
  DROP COLUMN avatar,
  DROP COLUMN cover_image;

ALTER TABLE public.users
  ADD COLUMN avatar uuid,
  ADD COLUMN cover_image uuid;

ALTER TABLE public.users
  ADD CONSTRAINT fk_media_avatar FOREIGN KEY (avatar) REFERENCES media(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_media_cover_image FOREIGN KEY (cover_image) REFERENCES media(id) ON DELETE SET NULL;


ALTER TABLE posts ADD COLUMN image uuid;

ALTER TABLE posts
  ADD CONSTRAINT fk_media FOREIGN KEY (image) REFERENCES media(id) ON DELETE SET NULL;
CREATE TABLE skills(
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  name text UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);



INSERT INTO skills(name) VALUES
('.NET_FRAMEWORK'),
('AGILE_METHODOLOGIES'),
('AWS'),
('ANDROID'),
('ANGULARJS'),
('ARCGIS'),
('AWS_LAMBDA'),
('BASH'),
('C'),
('C#'),
('C++'),
('CSS'),
('DJANGO'),
('DREAMWEAVER'),
('ECLIPSE'),
('GIT'),
('GOOGLE_ANALYTICS'),
('GCP'),
('HADOOP'),
('HTML'),
('JAVA'),
('JAVASCRIPT'),
('JQUERY'),
('JSON'),
('KOTLIN'),
('MACHINE_LEARNING'),
('MATLAB'),
('MAVEN'),
('MICROSOFT_T-SQL'),
('MONGODB'),
('NODE.JS'),
('NOSQL'),
('OBJECTIVE-C'),
('OBJECT-ORIENTED_PROGRAMMING'),
('PHP'),
('PYTHON'),
('R_PROGRAMMING'),
('REACT.JS'),
('REST_API'),
('RHINO_3D'),
('RUBY-ON-RAILS'),
('SCALA'),
('SEO'),
('SPRING_FRAMEWORK'),
('SWIFT'),
('UNITY'),
('VBA'),
('WINDOWS_SERVER'),
('WORDPRESS'),
('XML'),
('ADOBE_ACROBAT'),
('GOOGLE_ADS'),
('MICROSOFT_ACCESS'),
('MICROSOFT_AZURE'),
('MICROSOFT_EXCEL'),
('MICROSOFT_OUTLOOK'),
('MICROSOFT_POWER_BI'),
('MICROSOFT_POWERPOINT'),
('MICROSOFT_PROJECT'),
('MICROSOFT_SHAREPOINT'),
('MICROSOFT_VISIO'),
('MICROSOFT_WORD'),
('QUICKBOOKS'),
('ADOBE_ANIMATE'),
('ADOBE_ILLUSTRATOR'),
('ADOBE_LIGHTROOM'),
('ADOBE_PHOTOSHOP'),
('ADOBE_PREMIER_PRO'),
('ADOBE_XD'),
('AFTER_EFFECTS'),
('AUTOCAD'),
('AUTODESK_FUSION_360'),
('AUTODESK_INVENTOR'),
('AVID_MEDIA_COMPOSER'),
('FINAL_CUT_PRO'),
('IMOVIE'),
('INDESIGN'),
('KEYNOTE'),
('LOGIC_PRO'),
('PRO_TOOLS'),
('REVIT'),
('SKETCHUP'),
('SOLIDWORKS'),
('DART'),
('REACT_NATIVE'),
('FLUTTER'),
('PROGRAMMING'),
('ALGORITHMS'),
('AI'),
('DATA_SCIENCE'),
('SOFTWARE_ENGINEERING'),
('DATA_MINING'),
('SHELL_SCRIPTING'),
('SOFTWARE_DEVELOPMENT'),
('COMPUTER_SCIENCE'),
('RUBY'),
('LINUX'),
('NATURAL_LANGUAGE_PROCESSING'),
('APACHE_SPARK'),
('APACHE_PIG'),
('OPEN_CV'),
('UNSUPERVISED_LEARNING'),
('COLLABORATIVE_FILTERING'),
('GOOGLE_AD_MANAGER'),
('GOOGLE_ADSENSE'),
('GOOGLE_ADMOB'),
('WEB_DEVELOPMENT'),
('DIGITAL_MARKETING'),
('MARKETING'),
('CRM'),
('UI_UX_DESIGN'),
('UI_DESIGN'),
('UI_UX_DESIGN'),
('BUSINESS_DEVELOPMENT'),
('CSR'),
('GRAPHIC_DESIGN'),
('SOCIAL_MEDIA_MARKETING'),
('EDITING'),
('SOCIAL_ENTREPRENEURSHIP'),
('PHOTOGRAPHY'),
('PROJECT_MANAGEMENT'),
('EVENT_MANAGEMENT'),
('INTERNATIONAL_DEVELOPMENT'),
('BRAND_MANAGEMENT'),
('STATISTICAL_DATA_ANALYSIS'),
('QUANTITATIVE_RESEARCH'),
('QUALITATIVE_RESEARCH'),
('RESEARCH'),
('DATA_MODELING'),
('MANAGEMENT'),
('FUNDRAISING'),
('CAPACITY_BUILDING'),
('LEADERSHIP'),
('PUBLIC_SPEAKING'),
('COACHING'),
('CAREER_COUNSELING'),
('STRATEGIC_PARTNERSHIPS'),
('ADVOCACY'),
('SALES'),
('GAMIFICATION'),
('FINANCIAL_ANALYSIS'),
('MANAGEMENT_CONSULTING'),
('INVESTMENT_BANKING'),
('PROGRAM_MANAGEMENT'),
('PRODUCT_MANAGEMENT'),
('MICROSOFT_OFFICE'),
('CAD'),
('STRATEGY'),
('ANSYS'),
('CATIA'),
('SIMULINK'),
('BLOOMBERG_TERMINAL'),
('SUSTAINABLE_FINANCE'),
('ESG'),
('ESG_INVESTING'),
('RESPONSIBLE_INVESTING'),
('DATA_ANALAYSIS'),
('RENEWABLE_ENERGY'),
('SOCIAL_IMPACT_ASSESSMENT'),
('ENVIRONMENTAL_IMPACT_ASSESSMENT'),
('SUSTAINABILITY'),
('STRATEGIC_COMMUNICATIONS'),
('PR'),
('DIVERSITY_INCLUSION'),
('SDGS'),
('DESIGN_THINKING'),
('HCD'),
('CLIMATE_CHANGE'),
('SUSTAINABLE_DEVELOPMENT'),
('AEM'),
('COMMUNICATION'),
('CUSTOMER_SERVICE'),
('TRAINING'),
('NEGOTIATION'),
('NETWORKING'),
('EDUCATION'),
('TESTING'),
('WRITING'),
('ADVERTISING'),
('DATABASES'),
('TECHNOLOGY'),
('FINANCE'),
('RETAIL'),
('ACCOUNTING'),
('SOCIAL_MEDIA'),
('ENGINEERING'),
('PROBLEM_SOLVING'),
('MARKETING_STRATEGY'),
('RECRUITING'),
('ORDER_FULFILLMENT'),
('CORPORATE_LAW'),
('HUMAN_RESOURCES'),
('PEOPLE_MANAGEMENT'),
('MANUFACTURING'),
('INTERNAL_AUDIT'),
('PRODUCT_DEVELOPMENT'),
('AUDITING'),
('PRESENTATIONS'),
('CONSTRUCTION'),
('REAL_ESTATE'),
('SALES_MANAGEMENT'),
('TEAM_BUILDING'),
('HEALTHCARE'),
('COMPLIANCE'),
('LEGAL'),
('INNOVATION'),
('MENTORING'),
('COMMERCIAL_REAL_ESTATE'),
('IT'),
('PROCESS_IMPROVEMENT'),
('CHANGE_MANAGEMENT'),
('HEAVY_EQUIPMENT'),
('FACILITIES_MANAGEMENT'),
('UAT'),
('OTHER'),
('IMPACT_INVESTING')
ON CONFLICT (name) DO NOTHING;
ALTER TABLE users ADD COLUMN skills text[];


ALTER TABLE projects ADD COLUMN remote_preference project_remote_preference_type;
ALTER TABLE users ADD COLUMN country varchar(3);
ALTER TABLE organizations DROP COLUMN country;
ALTER TABLE organizations ADD COLUMN country varchar(3);
ALTER TABLE organizations 
  ADD COLUMN  wallet_address text,
  ADD COLUMN  impact_score double precision NOT NULL DEFAULT 0,
  ADD COLUMN mission text,
  ADD COLUMN culture text,
  ADD COLUMN image uuid,
  ADD COLUMN cover_image uuid;


ALTER TABLE organizations 
  ADD CONSTRAINT fk_media_image FOREIGN KEY (image) REFERENCES media(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_media_cover_image FOREIGN KEY (cover_image) REFERENCES media(id) ON DELETE SET NULL;


ALTER TABLE organizations 
  ALTER COLUMN updated_at DROP NOT NULL,
  ALTER COLUMN email DROP NOT NULL;

ALTER TABLE organizations 
  DROP CONSTRAINT organizations_email_key,
  DROP CONSTRAINT organizations_phone_key;


ALTER TABLE projects
  DROP COLUMN title;

ALTER TABLE projects
  ADD COLUMN title text,
  ADD COLUMN expires_at timestamp,
  ADD COLUMN country varchar(3);  


ALTER TABLE posts
  ADD COLUMN shared uuid;

ALTER TABLE posts
  ADD CONSTRAINT fk_posts FOREIGN KEY (shared) REFERENCES posts(id) ON DELETE CASCADE;

CREATE UNIQUE INDEX idx_posts_shared ON posts (identity_id, shared);
CREATE TABLE comments(
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  identity_id uuid NOT NULL,
  post_id uuid NOT NULL,
  content text NOT NULL,
  reply_id uuid,
  replied boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE CASCADE,
  CONSTRAINT fk_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  CONSTRAINT fk_comment FOREIGN KEY (reply_id) REFERENCES comments(id) ON DELETE CASCADE
);


CREATE OR REPLACE FUNCTION new_comment()
  RETURNS TRIGGER AS
$$
BEGIN
  
  IF NEW.reply_id IS NOT NULL THEN
    UPDATE comments SET replied=true WHERE id=NEW.reply_id;
  END IF;

  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;


CREATE TRIGGER new_comment
    AFTER INSERT ON comments FOR EACH ROW EXECUTE FUNCTION new_comment();
CREATE OR REPLACE FUNCTION new_chat()
  RETURNS TRIGGER AS
$$
BEGIN
  INSERT INTO chats_participants (identity_id, chat_id, type, joined_by)
  VALUES(NEW.created_by, NEW.id, 'ADMIN', NEW.created_by);
  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;


CREATE TRIGGER new_chat
    AFTER INSERT ON chats FOR EACH ROW EXECUTE FUNCTION new_chat();
ALTER TABLE messages
  ADD COLUMN media uuid;

ALTER TABLE messages
  ADD CONSTRAINT fk_media FOREIGN KEY (media) REFERENCES media(id) ON DELETE SET NULL;
ALTER TABLE posts DROP COLUMN image;

ALTER TABLE posts
  ADD COLUMN media uuid[],
  ADD COLUMN likes int NOT NULL DEFAULT 0;


CREATE TABLE likes(
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  identity_id uuid NOT NULL,
  post_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX idx_liked ON likes (post_id, identity_id);

CREATE OR REPLACE FUNCTION liked()
  RETURNS TRIGGER AS
$$
BEGIN
  UPDATE posts SET likes = likes + 1 WHERE id=NEW.post_id;
  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION unliked()
  RETURNS TRIGGER AS
$$
BEGIN
  UPDATE posts SET likes = likes - 1 WHERE id=OLD.post_id;
  RETURN OLD;
END;
$$
LANGUAGE PLPGSQL;


CREATE TRIGGER liked
    AFTER INSERT ON likes FOR EACH ROW EXECUTE FUNCTION liked();

CREATE TRIGGER unliked
    BEFORE DELETE ON likes FOR EACH ROW EXECUTE FUNCTION unliked();
ALTER TABLE likes
  ADD CONSTRAINT fk_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE CASCADE;
  ALTER TABLE posts DROP COLUMN shared;

ALTER TABLE posts
  ADD COLUMN shared int DEFAULT 0,
  ADD COLUMN shared_id uuid;

ALTER TABLE posts
  ADD CONSTRAINT fk_post FOREIGN KEY (shared_id) REFERENCES posts(id) ON DELETE CASCADE;

CREATE UNIQUE INDEX idx_posts_shared ON posts (shared_id, identity_id);


CREATE OR REPLACE FUNCTION new_post()
  RETURNS TRIGGER AS
$$
BEGIN
  IF NEW.shared_id IS NOT NULL THEN
    UPDATE posts SET shared = shared + 1 WHERE id=NEW.shared_id;
  END IF;
  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION del_post()
  RETURNS TRIGGER AS
$$
BEGIN
  IF OLD.shared_id IS NOT NULL THEN
    UPDATE posts SET shared = shared - 1 WHERE id=OLD.shared_id;
  END IF;
  RETURN OLD;
END;
$$
LANGUAGE PLPGSQL;


CREATE TRIGGER new_post
    AFTER INSERT ON posts FOR EACH ROW EXECUTE FUNCTION new_post();

CREATE TRIGGER del_post
    BEFORE DELETE ON posts FOR EACH ROW EXECUTE FUNCTION del_post();
CREATE OR REPLACE FUNCTION set_users_identity()
  RETURNS TRIGGER AS
$$
DECLARE meta_data JSON;
BEGIN
  meta_data := (SELECT row_to_json(t) FROM (
    SELECT users.id, username, email, (NEW.first_name || ' ' || NEW.last_name) AS name, m.url AS avatar FROM users
    LEFT JOIN media m ON m.id=users.avatar
    ) t WHERE id = NEW.id);
    
  INSERT INTO identities (id, type, meta)  VALUES (NEW.id, 'users', meta_data) ON CONFLICT (id) DO UPDATE SET meta=meta_data;
  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION set_orgs_identity()
  RETURNS TRIGGER AS
$$
DECLARE meta_data JSON;
BEGIN
  meta_data := (SELECT row_to_json(t) FROM (
    SELECT o.id, name, email, m.url AS image FROM organizations o
    LEFT JOIN media m ON m.id=o.image
    ) t WHERE id = NEW.id);
    
  INSERT INTO identities (id, type, meta)  VALUES (NEW.id, 'organizations', meta_data) ON CONFLICT (id) DO UPDATE SET meta=meta_data;
  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;


UPDATE users SET id=id;
UPDATE organizations SET id=id;
ALTER TABLE otps ALTER COLUMN expired_at SET DEFAULT now() + INTERVAL '10 minute';


CREATE TABLE tokens_blacklist (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  token text,
  type token_type DEFAULT 'JWT_REFRESH',
  expires_at timestamp NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);


CREATE OR REPLACE FUNCTION cleaner()
  RETURNS TRIGGER AS
$$
BEGIN
  DELETE FROM tokens_blacklist WHERE expires_at < CURRENT_TIMESTAMP;
  RETURN NULL;
END;
$$
LANGUAGE PLPGSQL;

CREATE TRIGGER cleaner
    AFTER INSERT ON tokens_blacklist FOR EACH ROW EXECUTE FUNCTION cleaner();
DROP INDEX idx_liked;

ALTER TABLE likes
  ADD COLUMN comment_id uuid;

ALTER TABLE likes
  ADD CONSTRAINT fk_comment FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE;

ALTER TABLE comments
  ADD COLUMN likes int DEFAULT 0;


CREATE UNIQUE INDEX idx_liked_comments ON likes (post_id, identity_id, comment_id) WHERE (comment_id IS NOT NULL);
CREATE UNIQUE INDEX idx_liked_posts ON likes (post_id, identity_id) WHERE (comment_id IS NULL);



CREATE OR REPLACE FUNCTION liked()
  RETURNS TRIGGER AS
$$
BEGIN
  UPDATE posts SET likes = likes + 1 WHERE id=NEW.post_id AND NEW.comment_id IS NULL;
  UPDATE comments SET likes = likes + 1 WHERE id=NEW.comment_id AND NEW.comment_id IS NOT NULL;
  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION unliked()
  RETURNS TRIGGER AS
$$
BEGIN
  UPDATE posts SET likes = likes - 1 WHERE id=OLD.post_id AND NEW.comment_id IS NULL;
  UPDATE comments SET likes = likes - 1 WHERE id=NEW.comment_id AND NEW.comment_id IS NOT NULL;
  RETURN OLD;
END;
$$
LANGUAGE PLPGSQL;
DROP INDEX idx_posts_shared;
ALTER TABLE users DROP COLUMN profile_id;
ALTER TABLE users DROP COLUMN mobile_countries_id;

ALTER TABLE users ADD COLUMN mobile_country_code varchar(16);
ALTER TABLE organizations ADD COLUMN mobile_country_code varchar(16);
ALTER TABLE organizations
  ADD COLUMN created_by uuid;

CREATE OR REPLACE FUNCTION new_orgs()
  RETURNS TRIGGER AS
$$
BEGIN
  IF NEW.created_by IS NOT NULL THEN
    INSERT INTO follows (follower_identity_id, following_identity_id) 
      VALUES (NEW.created_by, NEW.id);
  END IF;
  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;



CREATE TRIGGER new_orgs
    AFTER INSERT ON organizations FOR EACH ROW EXECUTE FUNCTION new_orgs();
ALTER TABLE projects DROP COLUMN country_id;

ALTER TABLE projects 
  ADD COLUMN skills text[],
  ADD COLUMN causes_tags social_causes_type[];
CREATE TABLE questions (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  project_id uuid NOT NULL,
  question text NOT NULL,
  required boolean DEFAULT false,
  options text[],
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);


CREATE TABLE answers (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  project_id uuid NOT NULL,
  question_id uuid NOT NULL,
  applicant_id uuid NOT NULL,
  answer text,
  selected_option int,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  CONSTRAINT fk_applicant FOREIGN KEY (applicant_id) REFERENCES applicants(id) ON DELETE CASCADE
);
ALTER TABLE organizations ADD COLUMN shortname VARCHAR(200);

CREATE UNIQUE INDEX idx_orgs_shortname ON organizations (shortname);
CREATE OR REPLACE FUNCTION set_orgs_identity()
  RETURNS TRIGGER AS
$$
DECLARE meta_data JSON;
BEGIN
  meta_data := (SELECT row_to_json(t) FROM (
    SELECT o.id, shortname, name, email, m.url AS image FROM organizations o
    LEFT JOIN media m ON m.id=o.image
    ) t WHERE id = NEW.id);
    
  INSERT INTO identities (id, type, meta)  VALUES (NEW.id, 'organizations', meta_data) ON CONFLICT (id) DO UPDATE SET meta=meta_data;
  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;


UPDATE organizations SET id=id;
/* Replace with your SQL commands */ALTER TABLE chats ADD COLUMN participants uuid[];
ALTER TABLE projects 
ADD COLUMN other_party_id varchar(60) DEFAULT NULL, 
ADD COLUMN other_party_title varchar(250) DEFAULT NULL, 
ADD COLUMN other_party_url text DEFAULT NULL,
ADD UNIQUE(other_party_id, other_party_title);
CREATE OR REPLACE FUNCTION unliked()
  RETURNS TRIGGER AS
$$
BEGIN
  UPDATE posts SET likes = likes - 1 WHERE id=OLD.post_id AND OLD.comment_id IS NULL;
  UPDATE comments SET likes = likes - 1 WHERE id=NEW.comment_id AND OLD.comment_id IS NOT NULL;
  RETURN OLD;
END;
$$
LANGUAGE PLPGSQL;
INSERT INTO users (first_name, last_name, username, email, password)
VALUES('Guest', 'User', 'guest', 'guest@socious.io', 'guest')


ALTER TABLE organizations ADD COLUMN status org_status DEFAULT 'ACTIVE';


CREATE OR REPLACE FUNCTION set_users_identity()
  RETURNS TRIGGER AS
$$
DECLARE meta_data JSON;
BEGIN
  meta_data := (SELECT row_to_json(t) FROM (
    SELECT users.id, username, email, (NEW.first_name || ' ' || NEW.last_name) AS name, m.url AS avatar, status FROM users
    LEFT JOIN media m ON m.id=users.avatar
    ) t WHERE id = NEW.id);
    
  INSERT INTO identities (id, type, meta)  VALUES (NEW.id, 'users', meta_data) ON CONFLICT (id) DO UPDATE SET meta=meta_data;
  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION set_orgs_identity()
  RETURNS TRIGGER AS
$$
DECLARE meta_data JSON;
BEGIN
  meta_data := (SELECT row_to_json(t) FROM (
    SELECT o.id, shortname, name, email, m.url AS image, status FROM organizations o
    LEFT JOIN media m ON m.id=o.image
    ) t WHERE id = NEW.id);
    
  INSERT INTO identities (id, type, meta)  VALUES (NEW.id, 'organizations', meta_data) ON CONFLICT (id) DO UPDATE SET meta=meta_data;
  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;


UPDATE users SET id=id;
UPDATE organizations SET id=id;
ALTER TYPE project_remote_preference_type RENAME TO project_remote_preference_type_old;



ALTER TABLE projects DROP COLUMN remote_preference;

ALTER TABLE projects ADD COLUMN remote_preference project_remote_preference_type;
CREATE TABLE search_history (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  identity_id uuid,
  body jsonb,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  deleted_at timestamp,
  CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE CASCADE
);


CREATE OR REPLACE RULE upsert_search_history AS ON INSERT TO search_history
WHERE EXISTS(SELECT id FROM search_history WHERE updated_at + INTERVAL '30 second' > now() AND identity_id=NEW.identity_id LIMIT 1)
DO INSTEAD 
  UPDATE search_history SET updated_at=now(),body=NEW.body 
  WHERE id=(SELECT id FROM search_history WHERE updated_at + INTERVAL '30 second' > now() AND identity_id=NEW.identity_id LIMIT 1);
/* ---------- projects ---------------- */

ALTER TABLE projects ADD COLUMN search_tsv tsvector;

CREATE INDEX project_search_tsv_idx ON projects USING GIST (search_tsv); 



CREATE  FUNCTION project_tsv()
RETURNS TRIGGER AS
$$
DECLARE params text;
BEGIN   
  params := (SELECT concat_ws(' ', username, first_name, last_name) FROM users WHERE id=NEW.identity_id) || ' ' ||
  (SELECT concat_ws(' ', name, shortname) FROM organizations WHERE id=NEW.identity_id);

  NEW.search_tsv := to_tsvector(
    'english', 
    concat_ws(' ',
      NEW.title,
      NEW.description, 
      params
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER project_tsv_insert
    BEFORE INSERT ON projects FOR EACH ROW EXECUTE FUNCTION project_tsv();

CREATE TRIGGER project_tsv_update
    BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION project_tsv();


/* ---------- users ---------------- */

ALTER TABLE users ADD COLUMN search_tsv tsvector;

CREATE INDEX user_search_tsv_idx ON users USING GIST (search_tsv); 

CREATE FUNCTION user_tsv()
RETURNS TRIGGER AS
$$
BEGIN  
    NEW.search_tsv := to_tsvector(
    'english', 
    concat_ws(' ',
      NEW.username,
      NEW.first_name,
      NEW.last_name,
      NEW.city
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER user_tsv_insert
    BEFORE INSERT ON users FOR EACH ROW EXECUTE FUNCTION user_tsv();

CREATE TRIGGER user_tsv_update
    BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION user_tsv();



/* ---------- organizations ---------------- */

ALTER TABLE organizations ADD COLUMN search_tsv tsvector;

CREATE INDEX org_search_tsv_idx ON organizations USING GIST (search_tsv); 

CREATE OR REPLACE FUNCTION org_tsv()
RETURNS TRIGGER AS
$$
BEGIN  
    NEW.search_tsv := to_tsvector(
    'english', 
    concat_ws(' ',
      NEW.email,
      NEW.name,
      NEW.shortname,
      NEW.bio,
      NEW.description,
      NEW.city
    )
  );
  RETURN NEW;
END  
$$ LANGUAGE plpgsql;


CREATE TRIGGER org_tsv_insert
    BEFORE INSERT ON organizations FOR EACH ROW EXECUTE FUNCTION org_tsv();

CREATE TRIGGER org_tsv_update
    BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION org_tsv();



/* ---------- posts ---------------- */

ALTER TABLE posts ADD COLUMN search_tsv tsvector;

CREATE INDEX post_search_tsv_idx ON posts USING GIST (search_tsv); 

CREATE FUNCTION post_tsv()
RETURNS TRIGGER AS
$$
DECLARE params text;
BEGIN  
  
  params := (SELECT concat_ws(' ', username, first_name, last_name) FROM users WHERE id=NEW.identity_id) || ' ' ||
  (SELECT concat_ws(' ', name, shortname) FROM organizations WHERE id=NEW.identity_id);
  
    
  NEW.search_tsv := to_tsvector(
    'english', 
    concat_ws(' ',
      NEW.content,
      array_to_string(NEW.hashtags, ' '),
      array_to_string(NEW.causes_tags, ' '),
      params
    )
  );
  
  RETURN NEW;
END  
$$ LANGUAGE plpgsql;


CREATE TRIGGER post_tsv_insert
    BEFORE INSERT ON posts FOR EACH ROW EXECUTE FUNCTION post_tsv();

CREATE TRIGGER post_tsv_update
    BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION post_tsv();



UPDATE posts SET id=id;
UPDATE projects SET id=id;
UPDATE organizations SET id=id;
UPDATE users SET id=id;
UPDATE organizations SET shortname=split_part(id::text, '-', 5) WHERE shortname IS NULL;

ALTER TABLE organizations ALTER COLUMN shortname SET NOT NULL;
ALTER TYPE social_causes_type ADD VALUE 'LGBTQI';
ALTER TYPE social_causes_type RENAME TO social_causes_type_old;



UPDATE users SET social_causes=array_replace(social_causes, 'LGBTQI+', 'LGBTQI');
UPDATE organizations SET social_causes=array_replace(social_causes, 'LGBTQI+', 'LGBTQI');
UPDATE posts SET causes_tags=array_replace(causes_tags, 'LGBTQI+', 'LGBTQI');
UPDATE projects SET causes_tags=array_replace(causes_tags, 'LGBTQI+', 'LGBTQI');

ALTER TABLE users ALTER COLUMN social_causes TYPE social_causes_type[] USING social_causes::text::social_causes_type[];
ALTER TABLE organizations ALTER COLUMN social_causes TYPE social_causes_type[] USING social_causes::text::social_causes_type[];
ALTER TABLE posts ALTER COLUMN causes_tags TYPE social_causes_type[] USING causes_tags::text::social_causes_type[];
ALTER TABLE projects ALTER COLUMN causes_tags TYPE social_causes_type[] USING causes_tags::text::social_causes_type[];

DROP TYPE social_causes_type_old;



CREATE TABLE payments (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  identity_id uuid NOT NULL,
  transaction_id varchar(250) UNIQUE,
  amount float,
  currency payment_currency,
  service payment_service,
  meta jsonb,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  verified_at timestamp,
  canceled_at timestamp,
  CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE CASCADE
);

ALTER TABLE applicants 
  ALTER COLUMN offer_rate TYPE float USING assignment_total::float;

ALTER TABLE applicants 
  ALTER COLUMN assignment_total TYPE float USING assignment_total::float;

ALTER TABLE projects 
  ADD COLUMN total_escrow_amount float;

CREATE TABLE topups (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  identity_id uuid NOT NULL,
  project_id uuid NOT NULL,
  status topup_status DEFAULT 'WAITING',
  meta jsonb,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);


CREATE TABLE escrows (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  project_id uuid NOT NULL,
  payment_id uuid NOT NULL,
  topup_id uuid,
  amount float,
  currency payment_currency,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  released_at timestamp,
  refound_at timestamp,
  CONSTRAINT fk_payment FOREIGN KEY (payment_id) REFERENCES payments(id),
  CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_topup FOREIGN KEY (topup_id) REFERENCES topups(id)
);


CREATE FUNCTION payment_escrow()
RETURNS TRIGGER AS
$$
BEGIN
  IF NEW.meta->>'project_id' IS NOT NULL AND NEW.verified_at IS NOT NULL THEN
    INSERT INTO escrows (project_id, payment_id, amount, currency) VALUES (
      NEW.meta->>'project_id',
      NEW.id,
      NEW.amount,
      NEW.currency
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER payment_escrow
    AFTER UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION payment_escrow();


CREATE FUNCTION project_escrow()
RETURNS TRIGGER AS
$$
BEGIN   
  UPDATE projects SET total_escrow_amount = total_escrow_amount + NEW.amount WHERE id=NEW.project_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER project_escrow_insert
    AFTER INSERT ON escrows FOR EACH ROW EXECUTE FUNCTION project_escrow();

CREATE TRIGGER project_escrow_update
    AFTER UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION project_escrow();

ALTER TABLE applicants 
  ADD COLUMN weekly_limit int,
  ADD COLUMN total_hours int DEFAULT 1;

CREATE TABLE employees (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  identity_id uuid NOT NULL,
  project_id uuid NOT NULL,
  applicant_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE CASCADE,
  CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_applicant FOREIGN KEY (applicant_id) REFERENCES applicants(id)
);


CREATE INDEX idx_identity_project ON employees (identity_id, project_id);


CREATE FUNCTION applicant_employee()
RETURNS TRIGGER AS
$$
BEGIN
  IF NEW.status = 'HIRED' AND NOT EXISTS (SELECT id FROM employees WHERE identity_id=NEW.identity_id AND project_id=NEW.project_id) THEN
    INSERT INTO employees (project_id, identity_id, applicant_id) VALUES (
      NEW.project_id,
      NEW.identity_id,
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
ALTER TABLE projects ADD COLUMN city varchar(250);
DROP TRIGGER del_post ON posts;


CREATE TRIGGER del_post
    AFTER DELETE ON posts FOR EACH ROW EXECUTE FUNCTION del_post();
DROP TRIGGER project_escrow_update ON projects;

CREATE TRIGGER project_escrow_update
    AFTER UPDATE ON escrows FOR EACH ROW EXECUTE FUNCTION project_escrow();


CREATE TRIGGER applicant_employee
    AFTER UPDATE ON applicants FOR EACH ROW EXECUTE FUNCTION applicant_employee();
ALTER TABLE chats_participants ALTER COLUMN joined_by DROP NOT NULL;

ALTER TABLE chats_participants DROP CONSTRAINT fk_joined_by_identity;

ALTER TABLE chats_participants ADD CONSTRAINT fk_joined_by_identity FOREIGN KEY (joined_by) REFERENCES identities(id) ON DELETE SET NULL;
ALTER TABLE projects 
  ADD COLUMN weekly_hours_lower varchar(200),
  ADD COLUMN weekly_hours_higher varchar(200),
  ADD COLUMN commitment_hours_lower varchar(200),
  ADD COLUMN commitment_hours_higher varchar(200);


ALTER TABLE applicants
  ADD COLUMN cv_link text,
  ADD COLUMN cv_name varchar(128),
  ADD COLUMN share_contact_info boolean;
CREATE OR REPLACE FUNCTION applicant_employee()
RETURNS TRIGGER AS
$$
BEGIN
  IF NEW.status = 'HIRED' AND NOT EXISTS (SELECT id FROM employees WHERE identity_id=NEW.user_id AND project_id=NEW.project_id) THEN
    INSERT INTO employees (project_id, identity_id, applicant_id) VALUES (
      NEW.project_id,
      NEW.user_id,
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION payment_escrow()
RETURNS TRIGGER AS
$$
BEGIN
  IF NEW.meta->>'project_id' IS NOT NULL AND NEW.verified_at IS NOT NULL THEN
    INSERT INTO escrows (project_id, payment_id, amount, currency) VALUES (
      uuid(NEW.meta->>'project_id'),
      NEW.id,
      NEW.amount,
      NEW.currency
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION project_escrow()
RETURNS TRIGGER AS
$$
BEGIN   
  UPDATE projects SET total_escrow_amount = COALESCE(total_escrow_amount, 0) + NEW.amount WHERE id=NEW.project_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
ALTER TABLE applicants ADD COLUMN attachment uuid;

ALTER TABLE applicants
  ADD CONSTRAINT fk_media FOREIGN KEY (attachment) REFERENCES media(id) ON DELETE SET NULL;



ALTER TABLE employees 
  ADD COLUMN status employee_status DEFAULT 'ACTIVE',
  ADD COLUMN  complete_at timestamp,
  ADD COLUMN  updated_at timestamp;


ALTER TYPE applicants_status_type ADD VALUE 'CLOSED';

ALTER TABLE applicants
  ADD COLUMN closed_at timestamp;


CREATE TABLE feedbacks (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  content text,
  is_contest boolean,
  identity_id uuid NOT NULL,
  project_id uuid NOT NULL,
  employee_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE CASCADE
);


CREATE OR REPLACE FUNCTION employees_status()
RETURNS TRIGGER AS
$$
BEGIN
  IF NEW.status <> 'ACTIVE' THEN
    UPDATE applicants SET status = 'CLOSED' WHERE id=NEW.applicant_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER employees_status
    AFTER UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION employees_status();



CREATE TABLE experiences (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  user_id uuid NOT NULL,
  org_id uuid NOT NULL,
  title text,
  description text,
  skills text[],
  start_at timestamp NOT NULL,
  end_at timestamp,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_org FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE languages (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  name varchar(64) NOT NULL,
  level language_level,
  user_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


ALTER TABLE users
  ADD COLUMN certificates text[],
  ADD COLUMN golas text,
  ADD COLUMN educations text[];
ALTER TABLE users DROP COLUMN golas;
ALTER TABLE users ADD COLUMN goals text;
ALTER TABLE users DROP CONSTRAINT users_phone_key;


CREATE INDEX user_phone_idx ON users (phone, mobile_country_code); 

CREATE OR REPLACE FUNCTION set_users_identity()
  RETURNS TRIGGER AS
$$
DECLARE meta_data JSON;
BEGIN
  meta_data := (SELECT row_to_json(t) FROM (
    SELECT 
      users.id,
      username,
      email,
      (NEW.first_name || ' ' || NEW.last_name) AS name,
      m.url AS avatar,
      status,
      country,
      city,
      address
    FROM users
    LEFT JOIN media m ON m.id=users.avatar
    ) t WHERE id = NEW.id);
    
  INSERT INTO identities (id, type, meta)  VALUES (NEW.id, 'users', meta_data) ON CONFLICT (id) DO UPDATE SET meta=meta_data;
  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION set_orgs_identity()
  RETURNS TRIGGER AS
$$
DECLARE meta_data JSON;
BEGIN
  meta_data := (SELECT row_to_json(t) FROM (
    SELECT 
      o.id,
      shortname,
      name,
      email,
      m.url AS image,
      status,
      country,
      city,
      address
    FROM organizations o
    LEFT JOIN media m ON m.id=o.image
    ) t WHERE id = NEW.id);
    
  INSERT INTO identities (id, type, meta)  VALUES (NEW.id, 'organizations', meta_data) ON CONFLICT (id) DO UPDATE SET meta=meta_data;
  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;


UPDATE users SET id=id;
UPDATE organizations SET id=id;
CREATE OR REPLACE FUNCTION user_tsv()
RETURNS TRIGGER AS
$$
BEGIN  
    NEW.search_tsv := to_tsvector(
    'english', 
    concat_ws(' ',
      NEW.username,
      NEW.first_name,
      NEW.last_name,
      NEW.city,
      NEW.bio,
      NEW.mission,
      NEW.phone,
      NEW.goals,
      array_to_string(NEW.skills, ' '),
      array_to_string(NEW.social_causes, ' ')
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


UPDATE users SET id=id;
DROP TABLE notifications_settings;

ALTER TYPE notification_type ADD VALUE 'OFFER';
ALTER TYPE notification_type ADD VALUE 'REJECT';
ALTER TYPE notification_type ADD VALUE 'APPROVED';
ALTER TYPE notification_type ADD VALUE 'HIRED';
ALTER TYPE notification_type ADD VALUE 'PROJECT_COMPLETE';
ALTER TYPE notification_type  ADD VALUE 'EMPLOYEE_CANCELED';
ALTER TYPE notification_type  ADD VALUE 'EMPLOYER_CANCELED';
ALTER TYPE notification_type ADD VALUE 'EMPLOYER_CONFIRMED';


CREATE TABLE IF NOT EXISTS notifications_settings(
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  user_id uuid NOT NULL,
  type notification_type NOT NULL,
  email boolean DEFAULT true,
  in_app boolean DEFAULT true,
  push boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);


CREATE UNIQUE INDEX idx_notif_settings ON notifications_settings (user_id, type);
ALTER TABLE employees RENAME TO missions;



CREATE TABLE offers (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  project_id uuid NOT NULL,
  recipient_id uuid NOT NULL,
  offerer_id uuid NOT NULL,
  applicant_id uuid,
  assignment_total float DEFAULT 0,
  offer_rate float DEFAULT 0,
  offer_message text,
  status offers_status_type DEFAULT 'PENDING',
  payment_type payment_type,
  due_date timestamp,
  payment_scheme payment_scheme,
  weekly_limit int,
  total_hours int DEFAULT 1,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_identity_recipient FOREIGN KEY (recipient_id) REFERENCES identities(id) ON DELETE CASCADE,
  CONSTRAINT fk_identity_offerer FOREIGN KEY (offerer_id) REFERENCES identities(id) ON DELETE CASCADE,
  CONSTRAINT fk_applicant FOREIGN KEY (applicant_id) REFERENCES applicants(id) ON DELETE SET NULL
);


ALTER TABLE applicants 
  DROP COLUMN weekly_limit,
  DROP COLUMN total_hours,
  DROP COLUMN due_date,
  DROP COLUMN assignment_total;

DROP TRIGGER applicant_employee ON applicants;
DROP FUNCTION applicant_employee;

DROP TRIGGER employees_status ON missions;
DROP FUNCTION employees_status;



ALTER TABLE missions ALTER COLUMN applicant_id DROP NOT NULL;
ALTER TABLE missions RENAME COLUMN identity_id TO assignee_id;
ALTER TABLE missions ADD COLUMN assigner_id uuid NOT NULL;
ALTER TABLE missions ADD COLUMN offer_id uuid NOT NULL;
ALTER TABLE missions ADD CONSTRAINT fk_offer FOREIGN KEY (offer_id) REFERENCES offers(id) ON DELETE CASCADE;
ALTER TABLE missions ADD CONSTRAINT fk_identity_assigner FOREIGN KEY (assigner_id) REFERENCES identities(id) ON DELETE CASCADE;
ALTER TABLE missions DROP COLUMN status;
ALTER TABLE missions ADD COLUMN status mission_status DEFAULT 'ACTIVE';

ALTER TABLE feedbacks RENAME COLUMN employee_id TO mission_id;
ALTER TABLE feedbacks RENAME CONSTRAINT fk_employee TO fk_mission;


DROP TYPE employee_status;


CREATE FUNCTION offer_accepted()
RETURNS TRIGGER AS
$$
BEGIN
  IF NEW.status = 'HIRED' AND NOT EXISTS (SELECT id FROM missions WHERE assignee_id=NEW.recipient_id AND project_id=NEW.project_id) THEN
    INSERT INTO missions (project_id, assignee_id, assigner_id, offer_id, applicant_id) VALUES (
      NEW.project_id,
      NEW.recipient_id,
      NEW.offerer_id,
      NEW.id,
      NEW.applicant_id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER offer_accepted
    AFTER UPDATE ON offers FOR EACH ROW EXECUTE FUNCTION offer_accepted();


CREATE OR REPLACE FUNCTION missions_status()
RETURNS TRIGGER AS
$$
BEGIN
  IF NEW.status <> 'ACTIVE' THEN
    UPDATE applicants SET status = 'CLOSED' WHERE id=NEW.applicant_id;
    UPDATE offers SET status = 'CLOSED' WHERE id=NEW.offer_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER missions_status
    AFTER UPDATE ON missions FOR EACH ROW EXECUTE FUNCTION missions_status();
DROP INDEX user_phone_idx;


UPDATE users u1 
  SET phone=NULL,mobile_country_code=NULL
FROM users u2 
WHERE 
  u1.phone=u2.phone AND 
  u1.mobile_country_code=u2.mobile_country_code AND
  u1.id <> u2.id;


CREATE UNIQUE INDEX idx_phone_country_code ON users (phone, mobile_country_code);

DROP INDEX project_search_tsv_idx;
CREATE INDEX project_search_tsv_idx ON projects USING GIN (search_tsv); 


CREATE OR REPLACE FUNCTION project_tsv()
RETURNS TRIGGER AS
$$
DECLARE params text;
BEGIN   
  params := (SELECT concat_ws(' ', username, first_name, last_name) FROM users WHERE id=NEW.identity_id) || ' ' ||
  (SELECT concat_ws(' ', name, shortname) FROM organizations WHERE id=NEW.identity_id);

  NEW.search_tsv := to_tsvector(
    concat_ws(' ',
      NEW.title,
      NEW.description, 
      params
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

/* ------------------------------- */

DROP INDEX user_search_tsv_idx;
CREATE INDEX user_search_tsv_idx ON users USING GIN (search_tsv); 

CREATE OR REPLACE FUNCTION user_tsv()
RETURNS TRIGGER AS
$$
BEGIN  
    NEW.search_tsv := to_tsvector(
    concat_ws(' ',
      NEW.username,
      NEW.first_name,
      NEW.last_name,
      NEW.city,
      NEW.bio,
      NEW.mission,
      NEW.phone,
      NEW.goals,
      array_to_string(NEW.skills, ' '),
      array_to_string(NEW.social_causes, ' ')
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


/* ------------------------------- */

DROP INDEX org_search_tsv_idx;
CREATE INDEX org_search_tsv_idx ON organizations USING GIN (search_tsv); 

CREATE OR REPLACE FUNCTION org_tsv()
RETURNS TRIGGER AS
$$
BEGIN  
    NEW.search_tsv := to_tsvector(
    concat_ws(' ',
      NEW.email,
      NEW.name,
      NEW.shortname,
      NEW.bio,
      NEW.description,
      NEW.city
    )
  );
  RETURN NEW;
END  
$$ LANGUAGE plpgsql;


/* ------------------------------- */

DROP INDEX post_search_tsv_idx;
CREATE INDEX post_search_tsv_idx ON posts USING GIN (search_tsv); 

CREATE OR REPLACE FUNCTION post_tsv()
RETURNS TRIGGER AS
$$
DECLARE params text;
BEGIN  
  
  params := (SELECT concat_ws(' ', username, first_name, last_name) FROM users WHERE id=NEW.identity_id) || ' ' ||
  (SELECT concat_ws(' ', name, shortname) FROM organizations WHERE id=NEW.identity_id);
  
    
  NEW.search_tsv := to_tsvector(
    concat_ws(' ',
      NEW.content,
      array_to_string(NEW.hashtags, ' '),
      array_to_string(NEW.causes_tags, ' '),
      params
    )
  );
  
  RETURN NEW;
END  
$$ LANGUAGE plpgsql;


UPDATE posts SET id=id;
UPDATE projects SET id=id;
UPDATE organizations SET id=id;
UPDATE users SET id=id;




CREATE TABLE IF NOT EXISTS connections (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  status connect_status NOT NULL DEFAULT 'PENDING',
  text text,
  requester_id uuid NOT NULL,
  requested_id uuid NOT NULL,
  connected_at timestamp,
  relation_id varchar(255) UNIQUE NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_identity_requester FOREIGN KEY (requester_id) REFERENCES identities(id) ON DELETE CASCADE,
  CONSTRAINT fk_identity_requested FOREIGN KEY (requested_id) REFERENCES identities(id) ON DELETE CASCADE
);



CREATE OR REPLACE FUNCTION generate_relation()
RETURNS TRIGGER AS
$$
BEGIN  
  NEW.relation_id := (SELECT array_to_string(array_agg(a), '-', '')
    FROM (
      SELECT unnest(array[NEW.requested_id::text, NEW.requester_id::text]) as a 
      ORDER BY a) s
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION follow_on_connect()
RETURNS TRIGGER AS
$$
BEGIN
    IF NEW.status = 'CONNECTED' THEN
      
      INSERT INTO follows (follower_identity_id, following_identity_id) 
      VALUES (NEW.requested_id, New.requester_id)
      ON CONFLICT (follower_identity_id, following_identity_id) DO NOTHING;
      
      INSERT INTO follows (follower_identity_id, following_identity_id) 
      VALUES (NEW.requester_id, New.requested_id)
      ON CONFLICT (follower_identity_id, following_identity_id) DO NOTHING;
    
    END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER relation
    BEFORE INSERT ON connections FOR EACH ROW EXECUTE FUNCTION generate_relation();


CREATE TRIGGER follow_on_connect
    AFTER UPDATE ON connections FOR EACH ROW EXECUTE FUNCTION follow_on_connect();
ALTER TABLE emails DROP COLUMN "to";
ALTER TABLE emails DROP COLUMN subject;
ALTER TABLE emails DROP COLUMN body;
ALTER TABLE emails DROP COLUMN body_type;
ALTER TABLE emails DROP COLUMN service;

ALTER TABLE emails ADD COLUMN message_id varchar(255);
UPDATE emails SET message_id = id;
ALTER TABLE emails ALTER COLUMN message_id SET NOT NULL;

DROP TYPE email_service_type;



ALTER TABLE emails ADD COLUMN "to" text;
ALTER TABLE emails ADD COLUMN subject text;
ALTER TABLE emails ADD COLUMN body text;
ALTER TABLE emails ADD COLUMN body_type text;
ALTER TABLE emails ADD COLUMN service email_service_type;

UPDATE emails SET
  id = message_id::uuid,
  service = (options->>'service')::email_service_type,
  "to" = info->'personalizations'->0->'to'->0->>'email',
  subject = info->>'subject',
  body = info->'content'->0->>'value',
  body_type = info->'content'->0->>'type';

ALTER TABLE emails ALTER COLUMN "to" SET NOT NULL;
ALTER TABLE emails ALTER COLUMN subject SET NOT NULL;
ALTER TABLE emails ALTER COLUMN body SET NOT NULL;
ALTER TABLE emails ALTER COLUMN body_type SET NOT NULL;
ALTER TABLE emails ALTER COLUMN service SET NOT NULL;
ALTER TABLE emails DROP COLUMN message_id;
ALTER TABLE users ALTER COLUMN password DROP NOT NULL;
ALTER TABLE organizations
  ADD COLUMN other_party_id varchar(60), 
  ADD COLUMN other_party_title varchar(250), 
  ADD COLUMN other_party_url text;

CREATE INDEX idx_matrix_unique ON organizations (other_party_id, other_party_title);
DROP TABLE geonames_alt;
DROP TABLE geonames;
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
  admin2_code VARCHAR(20),
  iso_code VARCHAR(20),
  fips_code VARCHAR(20),
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
/* Replace with your SQL commands */ALTER TABLE users ADD COLUMN geoname_id INTEGER;
ALTER TABLE users ADD CONSTRAINT fk_geoname FOREIGN KEY (geoname_id) REFERENCES geonames(id) ON DELETE CASCADE;
ALTER TABLE organizations ADD COLUMN geoname_id INTEGER;
ALTER TABLE organizations ADD CONSTRAINT fk_geoname FOREIGN KEY (geoname_id) REFERENCES geonames(id) ON DELETE CASCADE;
ALTER TABLE projects ADD COLUMN geoname_id INTEGER;
ALTER TABLE projects ADD CONSTRAINT fk_geoname FOREIGN KEY (geoname_id) REFERENCES geonames(id) ON DELETE CASCADE;
CREATE OR REPLACE FUNCTION org_tsv()
RETURNS TRIGGER AS
$$
BEGIN  
    NEW.search_tsv := to_tsvector(
    concat_ws(' ',
      NEW.email,
      NEW.name,
      NEW.shortname,
      NEW.bio,
      NEW.description,
      NEW.city,
      NEW.address,
      NEW.mission,
      NEW.culture
    )
  );
  RETURN NEW;
END  
$$ LANGUAGE plpgsql;


UPDATE organizations SET id=id;
DELETE FROM
    devices d1
USING devices d2
WHERE
    d1.id <> d2.id AND 
    d1.token = d2.token;


DROP INDEX idx_user_token;

CREATE UNIQUE INDEX idx_device_tokens ON devices (token);
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'OFFER';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'REJECT';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'APPROVED';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'HIRED';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'PROJECT_COMPLETE';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'ASSIGNEE_CANCELED';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'ASSIGNER_CANCELED';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'ASSIGNER_CONFIRMED';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'CONNECT';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'MEMBERED';
CREATE TABLE IF NOT EXISTS cards(
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  identity_id uuid NOT NULL,
  holder_name text,
  numbers varchar(16) NOT NULL,
  exp_month int NOT NULL,
  exp_year int NOT NULL,
  cvc varchar(32) NOT NULL,
  brand varchar(25),
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE CASCADE
);



ALTER TABLE payments 
  ADD COLUMN source text NOT NULL,
  ADD COLUMN source_type payment_source_type NOT NULL DEFAULT 'CARD';


DROP TRIGGER payment_escrow ON payments;
DROP FUNCTION payment_escrow;

ALTER TABLE escrows DROP COLUMN topup_id;
DROP TABLE topups;


DROP TRIGGER project_escrow_insert ON escrows;
DROP TRIGGER project_escrow_update ON escrows;

DROP FUNCTION project_escrow;


ALTER TABLE projects DROP COLUMN total_escrow_amount;
ALTER TABLE escrows 
  ADD COLUMN release_id text,
  ADD COLUMN mission_id uuid,
  ADD COLUMN offer_id uuid;

ALTER TABLE escrows 
  ADD CONSTRAINT fk_mission FOREIGN KEY (mission_id) REFERENCES missions(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_offer FOREIGN KEY (offer_id) REFERENCES offers(id) ON DELETE SET NULL;


DROP TRIGGER offer_accepted ON offers;
DROP FUNCTION offer_accepted;



CREATE TABLE IF NOT EXISTS oauth_connects(
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  identity_id uuid NOT NULL,
  provider oauth_connected_providers NOT NULL,
  matrix_unique_id text NOT NULL,
  access_token text NOT NULL,
  refresh_token text,
  meta jsonb,
  status user_status DEFAULT 'ACTIVE',
  expired_at timestamp,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE CASCADE
);


CREATE UNIQUE INDEX idx_oauth_mui ON oauth_connects (identity_id, provider);
CREATE TABLE job_categories (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  name text NOT NULL,
  hourly_wage_dollars float,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE skills ADD COLUMN job_category_id uuid;
ALTER TABLE skills
  ADD CONSTRAINT fk_job_category FOREIGN KEY (job_category_id) REFERENCES job_categories(id) ON DELETE SET NULL;


ALTER TABLE users RENAME COLUMN impact_score TO impact_points;
ALTER TABLE organizations RENAME COLUMN impact_score TO impact_points;


ALTER TYPE social_causes_type ADD VALUE 'ABORTION';
ALTER TYPE social_causes_type ADD VALUE 'EUTHANASIA';
ALTER TYPE social_causes_type  ADD VALUE 'NEURODIVERSITY';
ALTER TYPE social_causes_type  ADD VALUE 'SUSTAINABLE_COMMUNITIES';
ALTER TYPE social_causes_type  ADD VALUE 'BIODIVERSITY_LIFE_BELOW_WATER';
ALTER TYPE social_causes_type  ADD VALUE 'PEACE_JUSTICE';
ALTER TYPE social_causes_type  ADD VALUE 'COLLABORATION_FOR_IMPACT';
ALTER TYPE social_causes_type  ADD VALUE 'INNOVATION';






CREATE TABLE impact_points_history (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  total_points double precision NOT NULL DEFAULT 0,
  mission_id uuid,
  identity_id uuid NOT NULL,
  social_cause social_causes_type,
  social_cause_category sdg_type,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_mission FOREIGN KEY (mission_id) REFERENCES missions(id) ON DELETE SET NULL,
  CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE CASCADE
);


CREATE OR REPLACE FUNCTION update_user_impact_points()
RETURNS TRIGGER AS
$$
BEGIN
  UPDATE users SET impact_points = impact_points + NEW.total_points WHERE id=NEW.identity_id;
  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;


CREATE TRIGGER update_user_impact_points
    AFTER INSERT ON impact_points_history FOR EACH ROW EXECUTE FUNCTION update_user_impact_points();
INSERT INTO job_categories (name, hourly_wage_dollars) VALUES
('Frontend development', 25),
('Backend development', 25),
('Full-stack development', 28),
('Blockchain development', 44.5),
('Data science', 37.5),
('UX/UI Design', 32),
('Web Design', 22.5),
('Graphic Design', 25),
('Video Editing', 22.5),
('Illustration', 22.5),
('Video Production', 22.5),
('Animation', 29),
('Photo Editing', 18.5),
('Brand Identity & Guidelines', 25),
('Sound Editing', 25),
('Print Design', 25),
('Social Media Marketing', 25),
('Marketing Strategy', 25),
('SEO', 25),
('Influencer Marketing', 25),
('Content Writing', 27.5),
('Project Management', 32),
('Product Management', 35),
('Recruiting', 25),
('HR Management', 25),
('Other', 20);



UPDATE skills SET job_category_id=cat.id FROM job_categories cat WHERE cat.name='Other';


ALTER TABLE offers 
  DROP COLUMN payment_type,
  DROP COLUMN payment_scheme;

ALTER TABLE skills DROP COLUMN job_category_id;

ALTER TABLE projects ADD COLUMN job_category_id uuid;

ALTER TABLE projects ADD CONSTRAINT fk_job_category FOREIGN KEY (job_category_id) REFERENCES job_categories(id);
UPDATE projects SET job_category_id=j.id FROM job_categories j WHERE j.name='Other';
ALTER TABLE users 
  ADD COLUMN is_admin boolean DEFAULT false;
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'ACCEPT_CONNECT';



CREATE TABLE submitted_works (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  status submit_works_status_type NOT NULL DEFAULT 'PENDING',
  project_id uuid NOT NULL,
  mission_id uuid NOT NULL,
  total_hours int DEFAULT 0,
  start_at timestamp NOT NULL,
  end_at timestamp NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
  CONSTRAINT fk_mission FOREIGN KEY (mission_id) REFERENCES missions(id) ON DELETE SET NULL
);


ALTER TABLE impact_points_history ADD COLUMN submitted_work_id uuid;
ALTER TABLE impact_points_history
  ADD CONSTRAINT fk_submitted_works FOREIGN KEY (submitted_work_id) REFERENCES submitted_works(id) ON DELETE SET NULL;
CREATE TABLE reports (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  identity_id uuid NOT NULL,
  blocked boolean DEFAULT false,
  comment text not null,
  post_id uuid,
  user_id uuid,
  org_id uuid,
  comment_id uuid,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_org FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE SET NULL,
  CONSTRAINT fk_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE SET NULL,
  CONSTRAINT fk_comment FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE SET NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_report_post ON reports(identity_id, post_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_report_user ON reports(identity_id, user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_report_comment ON reports(identity_id, comment_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_report_org ON reports(identity_id, org_id);

ALTER TABLE users ADD COLUMN proofspace_connect_id varchar(250) UNIQUE;



CREATE table webhooks(
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  party webhook_party_type NOT NULL,
  content jsonb,
  response jsonb,
  response_status_code int,
  response_at timestamp,
  created_at timestamp with time zone DEFAULT now() NOT NULL 
);
ALTER TABLE reports ADD COLUMN created_at timestamp with time zone DEFAULT now() NOT NULL;
ALTER TABLE organizations ADD COLUMN verified_impact boolean default false;


CREATE OR REPLACE FUNCTION set_orgs_identity()
  RETURNS TRIGGER AS
$$
DECLARE meta_data JSON;
BEGIN
  meta_data := (SELECT row_to_json(t) FROM (
    SELECT 
      o.id,
      shortname,
      name,
      email,
      m.url AS image,
      status,
      country,
      city,
      address,
      verified_impact
    FROM organizations o
    LEFT JOIN media m ON m.id=o.image
    ) t WHERE id = NEW.id);
    
  INSERT INTO identities (id, type, meta)  VALUES (NEW.id, 'organizations', meta_data) ON CONFLICT (id) DO UPDATE SET meta=meta_data;
  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;


UPDATE organizations SET id=id;
INSERT INTO skills(name) VALUES
('TRANSLATION'),
('INTERPRETATION');
ALTER TABLE missions 
   DROP CONSTRAINT fk_applicant;

ALTER TABLE missions 
    ADD CONSTRAINT fk_applicant FOREIGN KEY (applicant_id) REFERENCES applicants(id) ON DELETE SET NULL;
ALTER TYPE  payment_source_type ADD VALUE 'CRYPTO_WALLET';
ALTER TYPE payment_service ADD VALUE 'CRYPTO';


ALTER TABLE payments 
ADD COLUMN crypto_currency_address text;



ALTER TABLE offers ADD COLUMN payment_mode payment_mode_type DEFAULT 'CRYPTO';


CREATE OR REPLACE FUNCTION set_users_identity()
  RETURNS TRIGGER AS
$$
DECLARE meta_data JSON;
BEGIN
  meta_data := (SELECT row_to_json(t) FROM (
    SELECT 
      users.id,
      username,
      email,
      (NEW.first_name || ' ' || NEW.last_name) AS name,
      m.url AS avatar,
      status,
      country,
      city,
      address,
      wallet_address
    FROM users
    LEFT JOIN media m ON m.id=users.avatar
    ) t WHERE id = NEW.id);
    
  INSERT INTO identities (id, type, meta)  VALUES (NEW.id, 'users', meta_data) ON CONFLICT (id) DO UPDATE SET meta=meta_data;
  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION set_orgs_identity()
  RETURNS TRIGGER AS
$$
DECLARE meta_data JSON;
BEGIN
  meta_data := (SELECT row_to_json(t) FROM (
    SELECT 
      o.id,
      shortname,
      name,
      email,
      m.url AS image,
      status,
      country,
      city,
      address,
      verified_impact,
      wallet_address
    FROM organizations o
    LEFT JOIN media m ON m.id=o.image
    ) t WHERE id = NEW.id);
    
  INSERT INTO identities (id, type, meta)  VALUES (NEW.id, 'organizations', meta_data) ON CONFLICT (id) DO UPDATE SET meta=meta_data;
  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;


UPDATE organizations SET id=id;
UPDATE users SET id=id;
ALTER TABLE offers ADD COLUMN crypto_currency_address text;
CREATE UNIQUE INDEX idx_other_party_mui ON organizations (other_party_id, other_party_title);



CREATE TABLE IF NOT EXISTS collector_jobs (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  service collector_jobs_services NOT NULL,
  job_name varchar(250) NOT NULL,
  has_more boolean DEFAULT false,
  fetch_counter int DEFAULT 1,
  last_modified_date timestamp,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE OR REPLACE FUNCTION set_orgs_identity()
  RETURNS TRIGGER AS
$$
DECLARE meta_data JSON;
BEGIN
  meta_data := (SELECT row_to_json(t) FROM (
    SELECT 
      o.id,
      shortname,
      name,
      description,
      mission,
      email,
      m.url AS image,
      status,
      country,
      city,
      address,
      verified_impact,
      wallet_address
    FROM organizations o
    LEFT JOIN media m ON m.id=o.image
    ) t WHERE id = NEW.id);
    
  INSERT INTO identities (id, type, meta)  VALUES (NEW.id, 'organizations', meta_data) ON CONFLICT (id) DO UPDATE SET meta=meta_data;
  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;


UPDATE organizations SET id=id;
CREATE OR REPLACE FUNCTION unliked()
  RETURNS TRIGGER AS
$$
BEGIN
  UPDATE posts SET likes = likes - 1 WHERE id=OLD.post_id AND OLD.comment_id IS NULL and likes > 0;
  UPDATE comments SET likes = likes - 1 WHERE id=NEW.comment_id AND OLD.comment_id IS NOT NULL and likes > 0;
  RETURN OLD;
END;
$$
LANGUAGE PLPGSQL;
ALTER TABLE notifications ADD COLUMN silent boolean DEFAULT false;
/* Replace with your SQL commands */
DELETE FROM feedbacks;
CREATE UNIQUE INDEX IF NOT EXISTS idx_mission_feedback ON feedbacks(identity_id, mission_id);
/* Replace with your SQL commands */
ALTER TABLE offers ADD COLUMN currency payment_currency DEFAULT 'USD';
ALTER TYPE oauth_connected_providers ADD VALUE 'STRIPE_JP';
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

  ALTER TABLE cards DROP COLUMN jp_customer;
ALTER TABLE cards ADD COLUMN is_jp boolean default false;
ALTER TABLE projects 
    ALTER COLUMN skills SET DEFAULT '{}';

UPDATE projects SET skills='{}' where skills IS NULL;
ALTER TABLE projects 
    ALTER COLUMN causes_tags SET DEFAULT '{}';

UPDATE projects SET causes_tags='{}' where causes_tags IS NULL;
ALTER TABLE users ADD COLUMN open_to_work boolean DEFAULT false;
ALTER TABLE users ADD COLUMN open_to_volunteer boolean DEFAULT false;

ALTER TABLE organizations ADD COLUMN hiring boolean DEFAULT false;



CREATE OR REPLACE FUNCTION set_orgs_identity()
  RETURNS TRIGGER AS
$$
DECLARE meta_data JSON;
BEGIN
  meta_data := (SELECT row_to_json(t) FROM (
    SELECT 
      o.id,
      shortname,
      name,
      description,
      mission,
      email,
      m.url AS image,
      status,
      country,
      city,
      address,
      verified_impact,
      wallet_address,
      hiring
    FROM organizations o
    LEFT JOIN media m ON m.id=o.image
    ) t WHERE id = NEW.id);
    
  INSERT INTO identities (id, type, meta)  VALUES (NEW.id, 'organizations', meta_data) ON CONFLICT (id) DO UPDATE SET meta=meta_data;
  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;



CREATE OR REPLACE FUNCTION set_users_identity()
  RETURNS TRIGGER AS
$$
DECLARE meta_data JSON;
BEGIN
  meta_data := (SELECT row_to_json(t) FROM (
    SELECT 
      users.id,
      username,
      email,
      (NEW.first_name || ' ' || NEW.last_name) AS name,
      m.url AS avatar,
      status,
      country,
      city,
      address,
      wallet_address,
      open_to_work,
      open_to_volunteer
    FROM users
    LEFT JOIN media m ON m.id=users.avatar
    ) t WHERE id = NEW.id);
    
  INSERT INTO identities (id, type, meta)  VALUES (NEW.id, 'users', meta_data) ON CONFLICT (id) DO UPDATE SET meta=meta_data;
  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;
CREATE OR REPLACE FUNCTION make_shotname_lowercase() 
RETURNS TRIGGER AS $$
DECLARE
    exists_shortname VARCHAR;
BEGIN
    NEW.shortname := LOWER(NEW.shortname);
    SELECT shortname INTO exists_shortname FROM organizations WHERE shortname=NEW.shortname AND id<>NEW.id;
    IF FOUND THEN
      NEW.shortname := NEW.shortname || '2';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER lowercase_trigger
BEFORE INSERT OR UPDATE
ON organizations
FOR EACH ROW
EXECUTE FUNCTION make_shotname_lowercase();


UPDATE organizations set id=id;
CREATE TABLE country_lookup (
    country_code CHAR(2),
    country_name TEXT
);


INSERT INTO country_lookup (country_code, country_name) VALUES 
('AF', 'Afghanistan'),
('AX', 'Åland Islands'),
('AL', 'Albania'),
('DZ', 'Algeria'),
('AS', 'American Samoa'),
('AD', 'Andorra'),
('AO', 'Angola'),
('AI', 'Anguilla'),
('AQ', 'Antarctica'),
('AG', 'Antigua and Barbuda'),
('AR', 'Argentina'),
('AM', 'Armenia'),
('AW', 'Aruba'),
('AU', 'Australia'),
('AT', 'Austria'),
('AZ', 'Azerbaijan'),
('BS', 'Bahamas'),
('BH', 'Bahrain'),
('BD', 'Bangladesh'),
('BB', 'Barbados'),
('BY', 'Belarus'),
('BE', 'Belgium'),
('BZ', 'Belize'),
('BJ', 'Benin'),
('BM', 'Bermuda'),
('BT', 'Bhutan'),
('BO', 'Bolivia (Plurinational State of)'),
('BQ', 'Bonaire, Sint Eustatius and Saba'),
('BA', 'Bosnia and Herzegovina'),
('BW', 'Botswana'),
('BV', 'Bouvet Island'),
('BR', 'Brazil'),
('IO', 'British Indian Ocean Territory'),
('BN', 'Brunei Darussalam'),
('BG', 'Bulgaria'),
('BF', 'Burkina Faso'),
('BI', 'Burundi'),
('CV', 'Cabo Verde'),
('KH', 'Cambodia'),
('CM', 'Cameroon'),
('CA', 'Canada'),
('KY', 'Cayman Islands'),
('CF', 'Central African Republic'),
('TD', 'Chad'),
('CL', 'Chile'),
('CN', 'China'),
('CX', 'Christmas Island'),
('CC', 'Cocos (Keeling) Islands'),
('CO', 'Colombia'),
('KM', 'Comoros'),
('CG', 'Congo'),
('CD', 'Congo (Democratic Republic of the)'),
('CK', 'Cook Islands'),
('CR', 'Costa Rica'),
('CI', 'Côte d Ivoire'),
('HR', 'Croatia'),
('CU', 'Cuba'),
('CW', 'Curaçao'),
('CY', 'Cyprus'),
('CZ', 'Czechia'),
('DK', 'Denmark'),
('DJ', 'Djibouti'),
('DM', 'Dominica'),
('DO', 'Dominican Republic'),
('EC', 'Ecuador'),
('EG', 'Egypt'),
('SV', 'El Salvador'),
('GQ', 'Equatorial Guinea'),
('ER', 'Eritrea'),
('EE', 'Estonia'),
('SZ', 'Eswatini'),
('ET', 'Ethiopia'),
('FK', 'Falkland Islands (Malvinas)'),
('FO', 'Faroe Islands'),
('FJ', 'Fiji'),
('FI', 'Finland'),
('FR', 'France'),
('GF', 'French Guiana'),
('PF', 'French Polynesia'),
('TF', 'French Southern Territories'),
('GA', 'Gabon'),
('GM', 'Gambia'),
('GE', 'Georgia'),
('DE', 'Germany'),
('GH', 'Ghana'),
('GI', 'Gibraltar'),
('GR', 'Greece'),
('GL', 'Greenland'),
('GD', 'Grenada'),
('GP', 'Guadeloupe'),
('GU', 'Guam'),
('GT', 'Guatemala'),
('GG', 'Guernsey'),
('GN', 'Guinea'),
('GW', 'Guinea-Bissau'),
('GY', 'Guyana'),
('HT', 'Haiti'),
('HM', 'Heard Island and McDonald Islands'),
('VA', 'Holy See'),
('HN', 'Honduras'),
('HK', 'Hong Kong'),
('HU', 'Hungary'),
('IS', 'Iceland'),
('IN', 'India'),
('ID', 'Indonesia'),
('IR', 'Iran (Islamic Republic of)'),
('IQ', 'Iraq'),
('IE', 'Ireland'),
('IM', 'Isle of Man'),
('IL', 'Israel'),
('IT', 'Italy'),
('JM', 'Jamaica'),
('JP', 'Japan'),
('JE', 'Jersey'),
('JO', 'Jordan'),
('KZ', 'Kazakhstan'),
('KE', 'Kenya'),
('KI', 'Kiribati'),
('KP', 'Korea (Democratic People s Republic of)'),
('KR', 'Korea (Republic of)'),
('KW', 'Kuwait'),
('KG', 'Kyrgyzstan'),
('LA', 'Lao Peoples Democratic Republic'),
('LV', 'Latvia'),
('LB', 'Lebanon'),
('LS', 'Lesotho'),
('LR', 'Liberia'),
('LY', 'Libya'),
('LI', 'Liechtenstein'),
('LT', 'Lithuania'),
('LU', 'Luxembourg'),
('MO', 'Macao'),
('MG', 'Madagascar'),
('MW', 'Malawi'),
('MY', 'Malaysia'),
('MV', 'Maldives'),
('ML', 'Mali'),
('MT', 'Malta'),
('MH', 'Marshall Islands'),
('MQ', 'Martinique'),
('MR', 'Mauritania'),
('MU', 'Mauritius'),
('YT', 'Mayotte'),
('MX', 'Mexico'),
('FM', 'Micronesia (Federated States of)'),
('MD', 'Moldova (Republic of)'),
('MC', 'Monaco'),
('MN', 'Mongolia'),
('ME', 'Montenegro'),
('MS', 'Montserrat'),
('MA', 'Morocco'),
('MZ', 'Mozambique'),
('MM', 'Myanmar'),
('NA', 'Namibia'),
('NR', 'Nauru'),
('NP', 'Nepal'),
('NL', 'Netherlands'),
('NC', 'New Caledonia'),
('NZ', 'New Zealand'),
('NI', 'Nicaragua'),
('NE', 'Niger'),
('NG', 'Nigeria'),
('NU', 'Niue'),
('NF', 'Norfolk Island'),
('MK', 'North Macedonia'),
('MP', 'Northern Mariana Islands'),
('NO', 'Norway'),
('OM', 'Oman'),
('PK', 'Pakistan'),
('PW', 'Palau'),
('PS', 'Palestine, State of'),
('PA', 'Panama'),
('PG', 'Papua New Guinea'),
('PY', 'Paraguay'),
('PE', 'Peru'),
('PH', 'Philippines'),
('PN', 'Pitcairn'),
('PL', 'Poland'),
('PT', 'Portugal'),
('PR', 'Puerto Rico'),
('QA', 'Qatar'),
('RE', 'Réunion'),
('RO', 'Romania'),
('RU', 'Russian Federation'),
('RW', 'Rwanda'),
('BL', 'Saint Barthélemy'),
('SH', 'Saint Helena, Ascension and Tristan da Cunha'),
('KN', 'Saint Kitts and Nevis'),
('LC', 'Saint Lucia'),
('MF', 'Saint Martin (French part)'),
('PM', 'Saint Pierre and Miquelon'),
('VC', 'Saint Vincent and the Grenadines'),
('WS', 'Samoa'),
('SM', 'San Marino'),
('ST', 'Sao Tome and Principe'),
('SA', 'Saudi Arabia'),
('SN', 'Senegal'),
('RS', 'Serbia'),
('SC', 'Seychelles'),
('SL', 'Sierra Leone'),
('SG', 'Singapore'),
('SX', 'Sint Maarten (Dutch part)'),
('SK', 'Slovakia'),
('SI', 'Slovenia'),
('SB', 'Solomon Islands'),
('SO', 'Somalia'),
('ZA', 'South Africa'),
('GS', 'South Georgia and the South Sandwich Islands'),
('SS', 'South Sudan'),
('ES', 'Spain'),
('LK', 'Sri Lanka'),
('SD', 'Sudan'),
('SR', 'Suriname'),
('SJ', 'Svalbard and Jan Mayen'),
('SE', 'Sweden'),
('CH', 'Switzerland'),
('SY', 'Syrian Arab Republic'),
('TW', 'Taiwan, Province of China'),
('TJ', 'Tajikistan'),
('TZ', 'Tanzania, United Republic of'),
('TH', 'Thailand'),
('TL', 'Timor-Leste'),
('TG', 'Togo'),
('TK', 'Tokelau'),
('TO', 'Tonga'),
('TT', 'Trinidad and Tobago'),
('TN', 'Tunisia'),
('TR', 'Turkey'),
('TM', 'Turkmenistan'),
('TC', 'Turks and Caicos Islands'),
('TV', 'Tuvalu'),
('UG', 'Uganda'),
('UA', 'Ukraine'),
('AE', 'United Arab Emirates'),
('GB', 'United Kingdom of Great Britain and Northern Ireland'),
('US', 'United States of America'),
('UM', 'United States Minor Outlying Islands'),
('UY', 'Uruguay'),
('UZ', 'Uzbekistan'),
('VU', 'Vanuatu'),
('VE', 'Venezuela (Bolivarian Republic of)'),
('VN', 'Viet Nam'),
('VG', 'Virgin Islands (British)'),
('VI', 'Virgin Islands (U.S.)'),
('WF', 'Wallis and Futuna'),
('EH', 'Western Sahara'),
('YE', 'Yemen'),
('ZM', 'Zambia'),
('ZW', 'Zimbabwe');


ALTER TABLE geonames 
  ADD COLUMN search_tsv tsvector,
  ADD COLUMN country_name text;

UPDATE geonames loc SET country_name=l.country_name FROM country_lookup l WHERE loc.country_code=l.country_code;

UPDATE geonames loc SET search_tsv=to_tsvector(concat_ws(' ',
  loc.name,
  loc.asciiname,
  loc.country_code,
  loc.country_name,
  loc.timezone
));
ALTER TYPE organization_type ADD VALUE 'STARTUP';

ALTER TABLE organizations ADD COLUMN size org_size;
ALTER TYPE organization_type ADD VALUE 'EDUCATIONAL';
ALTER TYPE organization_type ADD VALUE 'HEALTHCARE';
ALTER TYPE organization_type ADD VALUE 'RELIGIOUS';
ALTER TYPE organization_type ADD VALUE 'COMMERCIAL';
CREATE TABLE industries (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  name text UNIQUE NOT NULL
);

INSERT INTO industries(name) VALUES
('Abrasives and Nonmetallic Minerals Manufacturing'),
('Accessible Architecture and Design'),
('Accessible Hardware Manufacturing'),
('Accommodation'),
('Accommodation and Food Services'),
('Accounting'),
('Administration of Justice'),
('Administrative and Support Services'),
('Advertising Services'),
('Agricultural Chemical Manufacturing'),
('Agriculture, Construction, Mining Machinery Manufacturing'),
('Air, Water, and Waste Program Management'),
('Airlines and Aviation'),
('Airlines/Aviation'),
('Alternative Dispute Resolution'),
('Alternative Fuel Vehicle Manufacturing'),
('Alternative Medicine'),
('Ambulance Services'),
('Amusement Parks and Arcades'),
('Animal Feed Manufacturing'),
('Animation'),
('Animation and Post-production'),
('Apparel & Fashion'),
('Apparel Manufacturing'),
('Appliances, Electrical, and Electronics Manufacturing'),
('Architectural and Structural Metal Manufacturing'),
('Architecture & Planning'),
('Architecture and Planning'),
('Armed Forces'),
('Artificial Rubber and Synthetic Fiber Manufacturing'),
('Artists and Writers'),
('Arts and Crafts'),
('Audio and Video Equipment Manufacturing'),
('Automation Machinery Manufacturing'),
('Automotive'),
('Aviation & Aerospace'),
('Aviation and Aerospace Component Manufacturing'),
('Baked Goods Manufacturing'),
('Banking'),
('Bars, Taverns, and Nightclubs'),
('Bed-and-Breakfasts, Hostels, Homestays'),
('Beverage Manufacturing'),
('Biomass Electric Power Generation'),
('Biotechnology'),
('Biotechnology Research'),
('Blockchain Services'),
('Blogs'),
('Boilers, Tanks, and Shipping Container Manufacturing'),
('Book and Periodical Publishing'),
('Book Publishing'),
('Breweries'),
('Broadcast Media'),
('Broadcast Media Production and Distribution'),
('Building Construction'),
('Building Equipment Contractors'),
('Building Finishing Contractors'),
('Building Materials'),
('Building Structure and Exterior Contractors'),
('Business Consulting and Services'),
('Business Content'),
('Business Intelligence Platforms'),
('Business Supplies and Equipment'),
('Cable and Satellite Programming'),
('Capital Markets'),
('Caterers'),
('Chemical Manufacturing'),
('Chemical Raw Materials Manufacturing'),
('Chemicals'),
('Child Day Care Services'),
('Chiropractors'),
('Circuses and Magic Shows'),
('Civic & Social Organization'),
('Civic and Social Organizations'),
('Civil Engineering'),
('Claims Adjusting, Actuarial Services'),
('Clay and Refractory Products Manufacturing'),
('Climate Data and Analytics'),
('Climate Technology Product Manufacturing'),
('Coal Mining'),
('Collection Agencies'),
('Commercial and Industrial Equipment Rental'),
('Commercial and Industrial Machinery Maintenance'),
('Commercial and Service Industry Machinery Manufacturing'),
('Commercial Real Estate'),
('Communications Equipment Manufacturing'),
('Community Development and Urban Planning'),
('Community Services'),
('Computer & Network Security'),
('Computer and Network Security'),
('Computer Games'),
('Computer Hardware'),
('Computer Hardware Manufacturing'),
('Computer Networking'),
('Computer Networking Products'),
('Computer Software'),
('Computers and Electronics Manufacturing'),
('Conservation Programs'),
('Construction'),
('Construction Hardware Manufacturing'),
('Consumer Electronics'),
('Consumer Goods'),
('Consumer Goods Rental'),
('Consumer Services'),
('Correctional Institutions'),
('Cosmetics'),
('Cosmetology and Barber Schools'),
('Courts of Law'),
('Credit Intermediation'),
('Cutlery and Handtool Manufacturing'),
('Dairy'),
('Dairy Product Manufacturing'),
('Dance Companies'),
('Data Infrastructure and Analytics'),
('Data Security Software Products'),
('Defense & Space'),
('Defense and Space Manufacturing'),
('Dentists'),
('Design'),
('Design Services'),
('Desktop Computing Software Products'),
('Digital Accessibility Services'),
('Distilleries'),
('E-Learning'),
('E-Learning Providers'),
('Economic Programs'),
('Education'),
('Education Administration Programs'),
('Education Management'),
('Electric Lighting Equipment Manufacturing'),
('Electric Power Generation'),
('Electric Power Transmission, Control, and Distribution'),
('Electrical Equipment Manufacturing'),
('Electrical/Electronic Manufacturing'),
('Electronic and Precision Equipment Maintenance'),
('Embedded Software Products'),
('Emergency and Relief Services'),
('Engineering Services'),
('Engines and Power Transmission Equipment Manufacturing'),
('Entertainment'),
('Entertainment Providers'),
('Environmental Quality Programs'),
('Environmental Services'),
('Equipment Rental Services'),
('Events Services'),
('Executive Office'),
('Executive Offices'),
('Executive Search Services'),
('Fabricated Metal Products'),
('Facilities Services'),
('Family Planning Centers'),
('Farming'),
('Farming, Ranching, Forestry'),
('Fashion Accessories Manufacturing'),
('Financial Services'),
('Fine Art'),
('Fine Arts Schools'),
('Fire Protection'),
('Fisheries'),
('Fishery'),
('Flight Training'),
('Food & Beverages'),
('Food and Beverage Manufacturing'),
('Food and Beverage Retail'),
('Food and Beverage Services'),
('Food Production'),
('Footwear and Leather Goods Repair'),
('Footwear Manufacturing'),
('Forestry and Logging'),
('Fossil Fuel Electric Power Generation'),
('Freight and Package Transportation'),
('Fruit and Vegetable Preserves Manufacturing'),
('Fuel Cell Manufacturing'),
('Fund-Raising'),
('Fundraising'),
('Funds and Trusts'),
('Furniture'),
('Furniture and Home Furnishings Manufacturing'),
('Gambling & Casinos'),
('Gambling Facilities and Casinos'),
('Geothermal Electric Power Generation'),
('Glass Product Manufacturing'),
('Glass, Ceramics & Concrete'),
('Glass, Ceramics and Concrete Manufacturing'),
('Golf Courses and Country Clubs'),
('Government Administration'),
('Government Relations'),
('Government Relations Services'),
('Graphic Design'),
('Ground Passenger Transportation'),
('Health and Human Services'),
('Health, Wellness and Fitness'),
('Higher Education'),
('Highway, Street, and Bridge Construction'),
('Historical Sites'),
('Holding Companies'),
('Home Health Care Services'),
('Horticulture'),
('Hospital & Health Care'),
('Hospitality'),
('Hospitals'),
('Hospitals and Health Care'),
('Hotels and Motels'),
('Household and Institutional Furniture Manufacturing'),
('Household Appliance Manufacturing'),
('Household Services'),
('Housing and Community Development'),
('Housing Programs'),
('Human Resources'),
('Human Resources Services'),
('HVAC and Refrigeration Equipment Manufacturing'),
('Hydroelectric Power Generation'),
('Import and Export'),
('Individual & Family Services'),
('Individual and Family Services'),
('Industrial Automation'),
('Industrial Machinery Manufacturing'),
('Industry Associations'),
('Information Services'),
('Information Technology and Services'),
('Insurance'),
('Insurance Agencies and Brokerages'),
('Insurance and Employee Benefit Funds'),
('Insurance Carriers'),
('Interior Design'),
('International Affairs'),
('International Trade and Development'),
('Internet'),
('Internet Marketplace Platforms'),
('Internet News'),
('Internet Publishing'),
('Interurban and Rural Bus Services'),
('Investment Advice'),
('Investment Banking'),
('Investment Management'),
('IT Services and IT Consulting'),
('IT System Custom Software Development'),
('IT System Data Services'),
('IT System Design Services'),
('IT System Installation and Disposal'),
('IT System Operations and Maintenance'),
('IT System Testing and Evaluation'),
('IT System Training and Support'),
('Janitorial Services'),
('Judiciary'),
('Landscaping Services'),
('Language Schools'),
('Laundry and Drycleaning Services'),
('Law Enforcement'),
('Law Practice'),
('Leasing Non-residential Real Estate'),
('Leasing Residential Real Estate'),
('Leather Product Manufacturing'),
('Legal Services'),
('Legislative Office'),
('Legislative Offices'),
('Leisure, Travel & Tourism'),
('Libraries'),
('Lime and Gypsum Products Manufacturing'),
('Loan Brokers'),
('Logistics and Supply Chain'),
('Luxury Goods & Jewelry'),
('Machinery'),
('Machinery Manufacturing'),
('Magnetic and Optical Media Manufacturing'),
('Management Consulting'),
('Manufacturing'),
('Maritime'),
('Maritime Transportation'),
('Market Research'),
('Marketing and Advertising'),
('Marketing Services'),
('Mattress and Blinds Manufacturing'),
('Measuring and Control Instrument Manufacturing'),
('Meat Products Manufacturing'),
('Mechanical or Industrial Engineering'),
('Media and Telecommunications'),
('Media Production'),
('Medical and Diagnostic Laboratories'),
('Medical Device'),
('Medical Equipment Manufacturing'),
('Medical Practice'),
('Medical Practices'),
('Mental Health Care'),
('Metal Ore Mining'),
('Metal Treatments'),
('Metal Valve, Ball, and Roller Manufacturing'),
('Metalworking Machinery Manufacturing'),
('Military'),
('Military and International Affairs'),
('Mining'),
('Mining & Metals'),
('Mobile Computing Software Products'),
('Mobile Food Services'),
('Mobile Games'),
('Mobile Gaming Apps'),
('Motion Pictures and Film'),
('Motor Vehicle Manufacturing'),
('Motor Vehicle Parts Manufacturing'),
('Movies and Sound Recording'),
('Movies, Videos, and Sound'),
('Museums'),
('Museums and Institutions'),
('Museums, Historical Sites, and Zoos'),
('Music'),
('Musicians'),
('Nanotechnology'),
('Nanotechnology Research'),
('Natural Gas Distribution'),
('Natural Gas Extraction'),
('Newspaper Publishing'),
('Newspapers'),
('Non-Profit Organization Management'),
('Non-profit Organizations'),
('Nonmetallic Mineral Mining'),
('Nonresidential Building Construction'),
('Nuclear Electric Power Generation'),
('Nursing Homes and Residential Care Facilities'),
('Office Administration'),
('Office Furniture and Fixtures Manufacturing'),
('Oil & Energy'),
('Oil and Coal Product Manufacturing'),
('Oil and Gas'),
('Oil Extraction'),
('Oil, Gas, and Mining'),
('Online and Mail Order Retail'),
('Online Audio and Video Media'),
('Online Media'),
('Operations Consulting'),
('Optometrists'),
('Outpatient Care Centers'),
('Outsourcing and Offshoring Consulting'),
('Outsourcing/Offshoring'),
('Package/Freight Delivery'),
('Packaging and Containers'),
('Packaging and Containers Manufacturing'),
('Paint, Coating, and Adhesive Manufacturing'),
('Paper & Forest Products'),
('Paper and Forest Product Manufacturing'),
('Pension Funds'),
('Performing Arts'),
('Performing Arts and Spectator Sports'),
('Periodical Publishing'),
('Personal and Laundry Services'),
('Personal Care Product Manufacturing'),
('Personal Care Services'),
('Pet Services'),
('Pharmaceutical Manufacturing'),
('Pharmaceuticals'),
('Philanthropic Fundraising Services'),
('Philanthropy'),
('Photography'),
('Physical, Occupational and Speech Therapists'),
('Physicians'),
('Pipeline Transportation'),
('Plastics'),
('Plastics and Rubber Product Manufacturing'),
('Plastics Manufacturing'),
('Political Organization'),
('Political Organizations'),
('Postal Services'),
('Primary and Secondary Education'),
('Primary Metal Manufacturing'),
('Primary/Secondary Education'),
('Printing'),
('Printing Services'),
('Professional Organizations'),
('Professional Services'),
('Professional Training & Coaching'),
('Professional Training and Coaching'),
('Program Development'),
('Public Assistance Programs'),
('Public Health'),
('Public Policy'),
('Public Policy Offices'),
('Public Relations and Communications'),
('Public Relations and Communications Services'),
('Public Safety'),
('Publishing'),
('Racetracks'),
('Radio and Television Broadcasting'),
('Rail Transportation'),
('Railroad Equipment Manufacturing'),
('Railroad Manufacture'),
('Ranching'),
('Ranching and Fisheries'),
('Real Estate'),
('Real Estate Agents and Brokers'),
('Real Estate and Equipment Rental Services'),
('Recreational Facilities'),
('Recreational Facilities and Services'),
('Regenerative Design'),
('Religious Institutions'),
('Renewable Energy Equipment Manufacturing'),
('Renewable Energy Power Generation'),
('Renewable Energy Semiconductor Manufacturing'),
('Renewables & Environment'),
('Repair and Maintenance'),
('Research'),
('Research Services'),
('Residential Building Construction'),
('Restaurants'),
('Retail'),
('Retail Apparel and Fashion'),
('Retail Appliances, Electrical, and Electronic Equipment'),
('Retail Art Dealers'),
('Retail Art Supplies'),
('Retail Books and Printed News'),
('Retail Building Materials and Garden Equipment'),
('Retail Florists'),
('Retail Furniture and Home Furnishings'),
('Retail Gasoline'),
('Retail Groceries'),
('Retail Health and Personal Care Products'),
('Retail Luxury Goods and Jewelry'),
('Retail Motor Vehicles'),
('Retail Musical Instruments'),
('Retail Office Equipment'),
('Retail Office Supplies and Gifts'),
('Retail Pharmacies'),
('Retail Recyclable Materials & Used Merchandise'),
('Reupholstery and Furniture Repair'),
('Robot Manufacturing'),
('Robotics Engineering'),
('Rubber Products Manufacturing'),
('Satellite Telecommunications'),
('Savings Institutions'),
('School and Employee Bus Services'),
('Seafood Product Manufacturing'),
('Secretarial Schools'),
('Securities and Commodity Exchanges'),
('Security and Investigations'),
('Security Guards and Patrol Services'),
('Security Systems Services'),
('Semiconductor Manufacturing'),
('Semiconductors'),
('Services for Renewable Energy'),
('Services for the Elderly and Disabled'),
('Sheet Music Publishing'),
('Shipbuilding'),
('Shuttles and Special Needs Transportation Services'),
('Sightseeing Transportation'),
('Skiing Facilities'),
('Smart Meter Manufacturing'),
('Soap and Cleaning Product Manufacturing'),
('Social Networking Platforms'),
('Software Development'),
('Solar Electric Power Generation'),
('Sound Recording'),
('Space Research and Technology'),
('Specialty Trade Contractors'),
('Spectator Sports'),
('Sporting Goods'),
('Sporting Goods Manufacturing'),
('Sports'),
('Sports and Recreation Instruction'),
('Sports Teams and Clubs'),
('Spring and Wire Product Manufacturing'),
('Staffing and Recruiting'),
('Steam and Air-Conditioning Supply'),
('Strategic Management Services'),
('Subdivision of Land'),
('Sugar and Confectionery Product Manufacturing'),
('Supermarkets'),
('Surveying and Mapping Services'),
('Taxi and Limousine Services'),
('Technical and Vocational Training'),
('Technology, Information and Internet'),
('Technology, Information and Media'),
('Telecommunications'),
('Telecommunications Carriers'),
('Telephone Call Centers'),
('Temporary Help Services'),
('Textile Manufacturing'),
('Textiles'),
('Theater Companies'),
('Think Tanks'),
('Tobacco'),
('Tobacco Manufacturing'),
('Translation and Localization'),
('Transportation Equipment Manufacturing'),
('Transportation Programs'),
('Transportation, Logistics, Supply Chain and Storage'),
('Transportation/Trucking/Railroad'),
('Travel Arrangements'),
('Truck Transportation'),
('Trusts and Estates'),
('Turned Products and Fastener Manufacturing'),
('Urban Transit Services'),
('Utilities'),
('Utilities Administration'),
('Utility System Construction'),
('Vehicle Repair and Maintenance'),
('Venture Capital & Private Equity'),
('Venture Capital and Private Equity Principals'),
('Veterinary'),
('Veterinary Services'),
('Vocational Rehabilitation Services'),
('Warehousing'),
('Warehousing and Storage'),
('Waste Collection'),
('Waste Treatment and Disposal'),
('Water Supply and Irrigation Systems'),
('Water, Waste, Steam, and Air Conditioning Services'),
('Wellness and Fitness Services'),
('Wholesale'),
('Wholesale Alcoholic Beverages'),
('Wholesale Apparel and Sewing Supplies'),
('Wholesale Appliances, Electrical, and Electronics'),
('Wholesale Building Materials'),
('Wholesale Chemical and Allied Products'),
('Wholesale Computer Equipment'),
('Wholesale Drugs and Sundries'),
('Wholesale Food and Beverage'),
('Wholesale Footwear'),
('Wholesale Furniture and Home Furnishings'),
('Wholesale Hardware, Plumbing, Heating Equipment'),
('Wholesale Import and Export'),
('Wholesale Luxury Goods and Jewelry'),
('Wholesale Machinery'),
('Wholesale Metals and Minerals'),
('Wholesale Motor Vehicles and Parts'),
('Wholesale Paper Products'),
('Wholesale Petroleum and Petroleum Products'),
('Wholesale Photography Equipment and Supplies'),
('Wholesale Raw Farm Products'),
('Wholesale Recyclable Materials'),
('Wind Electric Power Generation'),
('Wine and Spirits'),
('Wineries'),
('Wireless'),
('Wireless Services'),
('Women''s Handbag Manufacturing'),
('Wood Product Manufacturing'),
('Writing and Editing'),
('Zoos and Botanical Gardens')
ON CONFLICT (name) DO NOTHING;


ALTER TABLE Organizations ADD COLUMN industry text;



CREATE TABLE additionals (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  type additional_type NOT NULL,
  title text,
  description text,
  url text,
  image uuid,
  sub_image uuid,
  identity_id uuid NOT NULL,
  ref_identity_id uuid,
  meta jsonb,
  enabled boolean DEFAULT true,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  
  CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE CASCADE,
  CONSTRAINT fk_ref_identity FOREIGN KEY (ref_identity_id) REFERENCES identities(id) ON DELETE CASCADE,
  CONSTRAINT fk_media_image FOREIGN KEY (image) REFERENCES media(id) ON DELETE SET NULL,
  CONSTRAINT fk_media_sub_image FOREIGN KEY (sub_image) REFERENCES media(id) ON DELETE SET NULL
)
ALTER TABLE geonames ADD COLUMN timezone_utc VARCHAR(50);

CREATE TABLE time_zones (
    timezone VARCHAR(255) PRIMARY KEY,
    timezone_utc VARCHAR(50)
);

INSERT INTO time_zones (timezone, timezone_utc) VALUES
('Africa/Abidjan', 'UTC+00:00'),
('Africa/Accra', 'UTC+00:00'),
('Africa/Addis_Ababa', 'UTC+03:00'),
('Africa/Algiers', 'UTC+01:00'),
('Africa/Asmara', 'UTC+03:00'),
('Africa/Bamako', 'UTC+00:00'),
('Africa/Bangui', 'UTC+01:00'),
('Africa/Banjul', 'UTC+00:00'),
('Africa/Bissau', 'UTC+00:00'),
('Africa/Blantyre', 'UTC+02:00'),
('Africa/Brazzaville', 'UTC+01:00'),
('Africa/Bujumbura', 'UTC+02:00'),
('Africa/Cairo', 'UTC+02:00'),
('Africa/Casablanca', 'UTC+01:00'),
('Africa/Ceuta', 'UTC+01:00'),
('Africa/Conakry', 'UTC+00:00'),
('Africa/Dakar', 'UTC+00:00'),
('Africa/Dar_es_Salaam', 'UTC+03:00'),
('Africa/Djibouti', 'UTC+03:00'),
('Africa/Douala', 'UTC+01:00'),
('Africa/El_Aaiun', 'UTC+01:00'),
('Africa/Freetown', 'UTC+00:00'),
('Africa/Gaborone', 'UTC+02:00'),
('Africa/Harare', 'UTC+02:00'),
('Africa/Johannesburg', 'UTC+02:00'),
('Africa/Juba', 'UTC+02:00'),
('Africa/Kampala', 'UTC+03:00'),
('Africa/Khartoum', 'UTC+02:00'),
('Africa/Kigali', 'UTC+02:00'),
('Africa/Kinshasa', 'UTC+01:00'),
('Africa/Lagos', 'UTC+01:00'),
('Africa/Libreville', 'UTC+01:00'),
('Africa/Lome', 'UTC+00:00'),
('Africa/Luanda', 'UTC+01:00'),
('Africa/Lubumbashi', 'UTC+02:00'),
('Africa/Lusaka', 'UTC+02:00'),
('Africa/Malabo', 'UTC+01:00'),
('Africa/Maputo', 'UTC+02:00'),
('Africa/Maseru', 'UTC+02:00'),
('Africa/Mbabane', 'UTC+02:00'),
('Africa/Mogadishu', 'UTC+03:00'),
('Africa/Monrovia', 'UTC+00:00'),
('Africa/Nairobi', 'UTC+03:00'),
('Africa/Ndjamena', 'UTC+01:00'),
('Africa/Niamey', 'UTC+01:00'),
('Africa/Nouakchott', 'UTC+00:00'),
('Africa/Ouagadougou', 'UTC+00:00'),
('Africa/Porto-Novo', 'UTC+01:00'),
('Africa/Sao_Tome', 'UTC+00:00'),
('Africa/Tripoli', 'UTC+02:00'),
('Africa/Tunis', 'UTC+01:00'),
('Africa/Windhoek', 'UTC+02:00'),
('America/Adak', 'UTC-10:00'),
('America/Anguilla', 'UTC-04:00'),
('America/Antigua', 'UTC-04:00'),
('America/Araguaina', 'UTC-03:00'),
('America/Araguaina', 'UTC-03:00'),
('America/Anchorage', 'UTC-09:00'),
('America/Anguilla', 'UTC-04:00'),
('America/Antigua', 'UTC-04:00'),
('America/Araguaina', 'UTC-03:00'),
('America/Anguilla', 'UTC-04:00'),
('America/Antigua', 'UTC-04:00'),
('America/Araguaina', 'UTC-03:00'),
('America/Argentina/Buenos_Aires', 'UTC-03:00'),
('America/Argentina/Catamarca', 'UTC-03:00'),
('America/Argentina/Cordoba', 'UTC-03:00'),
('America/Argentina/Jujuy', 'UTC-03:00'),
('America/Argentina/La_Rioja', 'UTC-03:00'),
('America/Argentina/Mendoza', 'UTC-03:00'),
('America/Argentina/Rio_Gallegos', 'UTC-03:00'),
('America/Argentina/Salta', 'UTC-03:00'),
('America/Argentina/San_Juan', 'UTC-03:00'),
('America/Argentina/San_Luis', 'UTC-03:00'),
('America/Argentina/Tucuman', 'UTC-03:00'),
('America/Argentina/Ushuaia', 'UTC-03:00'),
('America/Aruba', 'UTC-04:00'),
('America/Asuncion', 'UTC-03:00'),
('America/Atikokan', 'UTC-05:00'),
('America/Bahia', 'UTC-03:00'),
('America/Bahia_Banderas', 'UTC-06:00'),
('America/Barbados', 'UTC-04:00'),
('America/Belem', 'UTC-03:00'),
('America/Belize', 'UTC-06:00'),
('America/Blanc-Sablon', 'UTC-04:00'),
('America/Boa_Vista', 'UTC-04:00'),
('America/Bogota', 'UTC-05:00'),
('America/Boise', 'UTC-07:00'),
('America/Cambridge_Bay', 'UTC-07:00'),
('America/Campo_Grande', 'UTC-04:00'),
('America/Cancun', 'UTC-05:00'),
('America/Caracas', 'UTC-04:00'),
('America/Cayenne', 'UTC-03:00'),
('America/Cayman', 'UTC-05:00'),
('America/Chicago', 'UTC-06:00'),
('America/Chihuahua', 'UTC-07:00'),
('America/Costa_Rica', 'UTC-06:00'),
('America/Creston', 'UTC-07:00'),
('America/Cuiaba', 'UTC-04:00'),
('America/Curacao', 'UTC-04:00'),
('America/Danmarkshavn', 'UTC+00:00'),
('America/Dawson', 'UTC-08:00'),
('America/Dawson_Creek', 'UTC-07:00'),
('America/Denver', 'UTC-07:00'),
('America/Detroit', 'UTC-05:00'),
('America/Dominica', 'UTC-04:00'),
('America/Edmonton', 'UTC-07:00'),
('America/Eirunepe', 'UTC-05:00'),
('America/El_Salvador', 'UTC-06:00'),
('America/Fort_Nelson', 'UTC-07:00'),
('America/Fortaleza', 'UTC-03:00'),
('America/Glace_Bay', 'UTC-04:00'),
('America/Godthab', 'UTC-03:00'),
('America/Goose_Bay', 'UTC-04:00'),
('America/Grand_Turk', 'UTC-05:00'),
('America/Grenada', 'UTC-04:00'),
('America/Guadeloupe', 'UTC-04:00'),
('America/Guatemala', 'UTC-06:00'),
('America/Guayaquil', 'UTC-05:00'),
('America/Guyana', 'UTC-04:00'),
('America/Halifax', 'UTC-04:00'),
('America/Havana', 'UTC-05:00'),
('America/Hermosillo', 'UTC-07:00'),
('America/Indiana/Indianapolis', 'UTC-05:00'),
('America/Indiana/Knox', 'UTC-06:00'),
('America/Indiana/Marengo', 'UTC-05:00'),
('America/Indiana/Petersburg', 'UTC-05:00'),
('America/Indiana/Tell_City', 'UTC-06:00'),
('America/Indiana/Vevay', 'UTC-05:00'),
('America/Indiana/Vincennes', 'UTC-05:00'),
('America/Indiana/Winamac', 'UTC-05:00'),
('America/Inuvik', 'UTC-07:00'),
('America/Iqaluit', 'UTC-05:00'),
('America/Jamaica', 'UTC-05:00'),
('America/Juneau', 'UTC-09:00'),
('America/Kentucky/Louisville', 'UTC-05:00'),
('America/Kentucky/Monticello', 'UTC-05:00'),
('America/Kralendijk', 'UTC-04:00'),
('America/La_Paz', 'UTC-04:00'),
('America/Lima', 'UTC-05:00'),
('America/Los_Angeles', 'UTC-08:00'),
('America/Lower_Princes', 'UTC-04:00'),
('America/Maceio', 'UTC-03:00'),
('America/Managua', 'UTC-06:00'),
('America/Manaus', 'UTC-04:00'),
('America/Marigot', 'UTC-04:00'),
('America/Martinique', 'UTC-04:00'),
('America/Matamoros', 'UTC-06:00'),
('America/Mazatlan', 'UTC-07:00'),
('America/Menominee', 'UTC-06:00'),
('America/Merida', 'UTC-06:00'),
('America/Metlakatla', 'UTC-09:00'),
('America/Mexico_City', 'UTC-06:00'),
('America/Miquelon', 'UTC-03:00'),
('America/Moncton', 'UTC-04:00'),
('America/Monterrey', 'UTC-06:00'),
('America/Montevideo', 'UTC-03:00'),
('America/Montserrat', 'UTC-04:00'),
('America/Nassau', 'UTC-05:00'),
('America/New_York', 'UTC-05:00'),
('America/Nipigon', 'UTC-05:00'),
('America/Nome', 'UTC-09:00'),
('America/Noronha', 'UTC-02:00'),
('America/North_Dakota/Beulah', 'UTC-06:00'),
('America/North_Dakota/Center', 'UTC-06:00'),
('America/North_Dakota/New_Salem', 'UTC-06:00'),
('America/Nuuk', 'UTC-03:00'),
('America/Ojinaga', 'UTC-07:00'),
('America/Panama', 'UTC-05:00'),
('America/Pangnirtung', 'UTC-05:00'),
('America/Paramaribo', 'UTC-03:00'),
('America/Phoenix', 'UTC-07:00'),
('America/Port-au-Prince', 'UTC-05:00'),
('America/Port_of_Spain', 'UTC-04:00'),
('America/Porto_Velho', 'UTC-04:00'),
('America/Puerto_Rico', 'UTC-04:00'),
('America/Punta_Arenas', 'UTC-03:00'),
('America/Rainy_River', 'UTC-06:00'),
('America/Rankin_Inlet', 'UTC-06:00'),
('America/Recife', 'UTC-03:00'),
('America/Regina', 'UTC-06:00'),
('America/Resolute', 'UTC-06:00'),
('America/Rio_Branco', 'UTC-05:00'),
('America/Santarem', 'UTC-03:00'),
('America/Santiago', 'UTC-04:00'),
('America/Santo_Domingo', 'UTC-04:00'),
('America/Sao_Paulo', 'UTC-03:00'),
('America/Scoresbysund', 'UTC-01:00'),
('America/Sitka', 'UTC-09:00'),
('America/St_Barthelemy', 'UTC-04:00'),
('America/St_Johns', 'UTC-03:30'),
('America/St_Kitts', 'UTC-04:00'),
('America/St_Lucia', 'UTC-04:00'),
('America/St_Thomas', 'UTC-04:00'),
('America/St_Vincent', 'UTC-04:00'),
('America/Swift_Current', 'UTC-06:00'),
('America/Tegucigalpa', 'UTC-06:00'),
('America/Thule', 'UTC-04:00'),
('America/Thunder_Bay', 'UTC-05:00'),
('America/Tijuana', 'UTC-08:00'),
('America/Toronto', 'UTC-05:00'),
('America/Tortola', 'UTC-04:00'),
('America/Vancouver', 'UTC-08:00'),
('America/Whitehorse', 'UTC-08:00'),
('America/Winnipeg', 'UTC-06:00'),
('America/Yakutat', 'UTC-09:00'),
('America/Yellowknife', 'UTC-07:00'),
('Antarctica/Casey', 'UTC+08:00'),
('Antarctica/Davis', 'UTC+07:00'),
('Antarctica/DumontDUrville', 'UTC+10:00'),
('Antarctica/Macquarie', 'UTC+11:00'),
('Antarctica/Mawson', 'UTC+05:00'),
('Antarctica/McMurdo', 'UTC+12:00'),
('Antarctica/Palmer', 'UTC-03:00'),
('Antarctica/Rothera', 'UTC-03:00'),
('Antarctica/Syowa', 'UTC+03:00'),
('Antarctica/Troll', 'UTC+02:00'),
('Antarctica/Vostok', 'UTC+06:00'),
('Arctic/Longyearbyen', 'UTC+01:00'),
('Asia/Aden', 'UTC+03:00'),
('Asia/Almaty', 'UTC+06:00'),
('Asia/Amman', 'UTC+02:00'),
('Asia/Anadyr', 'UTC+12:00'),
('Asia/Aqtau', 'UTC+05:00'),
('Asia/Aqtobe', 'UTC+05:00'),
('Asia/Ashgabat', 'UTC+05:00'),
('Asia/Atyrau', 'UTC+05:00'),
('Asia/Baghdad', 'UTC+03:00'),
('Asia/Bahrain', 'UTC+03:00'),
('Asia/Baku', 'UTC+04:00'),
('Asia/Bangkok', 'UTC+07:00'),
('Asia/Barnaul', 'UTC+07:00'),
('Asia/Beirut', 'UTC+02:00'),
('Asia/Bishkek', 'UTC+06:00'),
('Asia/Brunei', 'UTC+08:00'),
('Asia/Chita', 'UTC+09:00'),
('Asia/Choibalsan', 'UTC+08:00'),
('Asia/Colombo', 'UTC+05:30'),
('Asia/Damascus', 'UTC+02:00'),
('Asia/Dhaka', 'UTC+06:00'),
('Asia/Dili', 'UTC+09:00'),
('Asia/Dubai', 'UTC+04:00'),
('Asia/Dushanbe', 'UTC+05:00'),
('Asia/Famagusta', 'UTC+02:00'),
('Asia/Gaza', 'UTC+02:00'),
('Asia/Hebron', 'UTC+02:00'),
('Asia/Ho_Chi_Minh', 'UTC+07:00'),
('Asia/Hong_Kong', 'UTC+08:00'),
('Asia/Hovd', 'UTC+07:00'),
('Asia/Irkutsk', 'UTC+08:00'),
('Asia/Jakarta', 'UTC+07:00'),
('Asia/Jayapura', 'UTC+09:00'),
('Asia/Jerusalem', 'UTC+02:00'),
('Asia/Kabul', 'UTC+04:30'),
('Asia/Kamchatka', 'UTC+12:00'),
('Asia/Karachi', 'UTC+05:00'),
('Asia/Kathmandu', 'UTC+05:45'),
('Asia/Khandyga', 'UTC+09:00'),
('Asia/Kolkata', 'UTC+05:30'),
('Asia/Krasnoyarsk', 'UTC+07:00'),
('Asia/Kuala_Lumpur', 'UTC+08:00'),
('Asia/Kuching', 'UTC+08:00'),
('Asia/Kuwait', 'UTC+03:00'),
('Asia/Macau', 'UTC+08:00'),
('Asia/Magadan', 'UTC+11:00'),
('Asia/Makassar', 'UTC+08:00'),
('Asia/Manila', 'UTC+08:00'),
('Asia/Muscat', 'UTC+04:00'),
('Asia/Nicosia', 'UTC+02:00'),
('Asia/Novokuznetsk', 'UTC+07:00'),
('Asia/Novosibirsk', 'UTC+07:00'),
('Asia/Omsk', 'UTC+06:00'),
('Asia/Oral', 'UTC+05:00'),
('Asia/Phnom_Penh', 'UTC+07:00'),
('Asia/Pontianak', 'UTC+07:00'),
('Asia/Pyongyang', 'UTC+09:00'),
('Asia/Qatar', 'UTC+03:00'),
('Asia/Qostanay', 'UTC+06:00'),
('Asia/Qyzylorda', 'UTC+05:00'),
('Asia/Riyadh', 'UTC+03:00'),
('Asia/Sakhalin', 'UTC+11:00'),
('Asia/Samarkand', 'UTC+05:00'),
('Asia/Seoul', 'UTC+09:00'),
('Asia/Shanghai', 'UTC+08:00'),
('Asia/Singapore', 'UTC+08:00'),
('Asia/Srednekolymsk', 'UTC+11:00'),
('Asia/Taipei', 'UTC+08:00'),
('Asia/Tashkent', 'UTC+05:00'),
('Asia/Tbilisi', 'UTC+04:00'),
('Asia/Tehran', 'UTC+03:30'),
('Asia/Thimphu', 'UTC+06:00'),
('Asia/Tokyo', 'UTC+09:00'),
('Asia/Tomsk', 'UTC+07:00'),
('Asia/Ulaanbaatar', 'UTC+08:00'),
('Asia/Urumqi', 'UTC+06:00'),
('Asia/Ust-Nera', 'UTC+10:00'),
('Asia/Vientiane', 'UTC+07:00'),
('Asia/Vladivostok', 'UTC+10:00'),
('Asia/Yakutsk', 'UTC+09:00'),
('Asia/Yangon', 'UTC+06:30'),
('Asia/Yekaterinburg', 'UTC+05:00'),
('Asia/Yerevan', 'UTC+04:00'),
('Atlantic/Azores', 'UTC-01:00'),
('Atlantic/Bermuda', 'UTC-04:00'),
('Atlantic/Canary', 'UTC+00:00'),
('Atlantic/Cape_Verde', 'UTC-01:00'),
('Atlantic/Faroe', 'UTC+00:00'),
('Atlantic/Madeira', 'UTC+00:00'),
('Atlantic/Reykjavik', 'UTC+00:00'),
('Atlantic/South_Georgia', 'UTC-02:00'),
('Atlantic/St_Helena', 'UTC+00:00'),
('Atlantic/Stanley', 'UTC-03:00'),
('Australia/Adelaide', 'UTC+09:30'),
('Australia/Brisbane', 'UTC+10:00'),
('Australia/Broken_Hill', 'UTC+09:30'),
('Australia/Currie', 'UTC+11:00'),
('Australia/Darwin', 'UTC+09:30'),
('Australia/Eucla', 'UTC+08:45'),
('Australia/Hobart', 'UTC+11:00'),
('Australia/Lindeman', 'UTC+10:00'),
('Australia/Lord_Howe', 'UTC+10:30'),
('Australia/Melbourne', 'UTC+11:00'),
('Australia/Perth', 'UTC+08:00'),
('Australia/Sydney', 'UTC+11:00'),
('Europe/Amsterdam', 'UTC+01:00'),
('Europe/Andorra', 'UTC+01:00'),
('Europe/Astrakhan', 'UTC+04:00'),
('Europe/Athens', 'UTC+02:00'),
('Europe/Belgrade', 'UTC+01:00'),
('Europe/Berlin', 'UTC+01:00'),
('Europe/Bratislava', 'UTC+01:00'),
('Europe/Brussels', 'UTC+01:00'),
('Europe/Bucharest', 'UTC+02:00'),
('Europe/Budapest', 'UTC+01:00'),
('Europe/Busingen', 'UTC+01:00'),
('Europe/Chisinau', 'UTC+02:00'),
('Europe/Copenhagen', 'UTC+01:00'),
('Europe/Dublin', 'UTC+00:00'),
('Europe/Gibraltar', 'UTC+01:00'),
('Europe/Guernsey', 'UTC+00:00'),
('Europe/Helsinki', 'UTC+02:00'),
('Europe/Isle_of_Man', 'UTC+00:00'),
('Europe/Istanbul', 'UTC+03:00'),
('Europe/Jersey', 'UTC+00:00'),
('Europe/Kaliningrad', 'UTC+02:00'),
('Europe/Kiev', 'UTC+02:00'),
('Europe/Kirov', 'UTC+03:00'),
('Europe/Lisbon', 'UTC+00:00'),
('Europe/Ljubljana', 'UTC+01:00'),
('Europe/London', 'UTC+00:00'),
('Europe/Luxembourg', 'UTC+01:00'),
('Europe/Madrid', 'UTC+01:00'),
('Europe/Malta', 'UTC+01:00'),
('Europe/Mariehamn', 'UTC+02:00'),
('Europe/Minsk', 'UTC+03:00'),
('Europe/Monaco', 'UTC+01:00'),
('Europe/Moscow', 'UTC+03:00'),
('Europe/Oslo', 'UTC+01:00'),
('Europe/Paris', 'UTC+01:00'),
('Europe/Podgorica', 'UTC+01:00'),
('Europe/Prague', 'UTC+01:00'),
('Europe/Riga', 'UTC+02:00'),
('Europe/Rome', 'UTC+01:00'),
('Europe/Samara', 'UTC+04:00'),
('Europe/San_Marino', 'UTC+01:00'),
('Europe/Sarajevo', 'UTC+01:00'),
('Europe/Saratov', 'UTC+04:00'),
('Europe/Simferopol', 'UTC+03:00'),
('Europe/Skopje', 'UTC+01:00'),
('Europe/Sofia', 'UTC+02:00'),
('Europe/Stockholm', 'UTC+01:00'),
('Europe/Tallinn', 'UTC+02:00'),
('Europe/Tirane', 'UTC+01:00'),
('Europe/Ulyanovsk', 'UTC+04:00'),
('Europe/Uzhgorod', 'UTC+02:00'),
('Europe/Vaduz', 'UTC+01:00'),
('Europe/Vatican', 'UTC+01:00'),
('Europe/Vienna', 'UTC+01:00'),
('Europe/Vilnius', 'UTC+02:00'),
('Europe/Volgograd', 'UTC+04:00'),
('Europe/Warsaw', 'UTC+01:00'),
('Europe/Zagreb', 'UTC+01:00'),
('Europe/Zaporozhye', 'UTC+02:00'),
('Europe/Zurich', 'UTC+01:00'),
('Indian/Antananarivo', 'UTC+03:00'),
('Indian/Chagos', 'UTC+06:00'),
('Indian/Christmas', 'UTC+07:00'),
('Indian/Cocos', 'UTC+06:30'),
('Indian/Comoro', 'UTC+03:00'),
('Indian/Kerguelen', 'UTC+05:00'),
('Indian/Mahe', 'UTC+04:00'),
('Indian/Maldives', 'UTC+05:00'),
('Indian/Mauritius', 'UTC+04:00'),
('Indian/Mayotte', 'UTC+03:00'),
('Indian/Reunion', 'UTC+04:00'),
('Pacific/Apia', 'UTC+13:00'),
('Pacific/Auckland', 'UTC+13:00'),
('Pacific/Bougainville', 'UTC+11:00'),
('Pacific/Chatham', 'UTC+13:45'),
('Pacific/Chuuk', 'UTC+10:00'),
('Pacific/Easter', 'UTC-06:00'),
('Pacific/Efate', 'UTC+11:00'),
('Pacific/Enderbury', 'UTC+13:00'),
('Pacific/Enderbury', 'UTC+13:00'),
('Pacific/Fakaofo', 'UTC+13:00'),
('Pacific/Fiji', 'UTC+12:00'),
('Pacific/Funafuti', 'UTC+12:00'),
('Pacific/Galapagos', 'UTC-06:00'),
('Pacific/Gambier', 'UTC-09:00'),
('Pacific/Guadalcanal', 'UTC+11:00'),
('Pacific/Guam', 'UTC+10:00'),
('Pacific/Honolulu', 'UTC-10:00'),
('Pacific/Kiritimati', 'UTC+14:00'),
('Pacific/Kosrae', 'UTC+11:00'),
('Pacific/Kwajalein', 'UTC+12:00'),
('Pacific/Majuro', 'UTC+12:00'),
('Pacific/Marquesas', 'UTC-09:30'),
('Pacific/Midway', 'UTC-11:00'),
('Pacific/Nauru', 'UTC+12:00'),
('Pacific/Niue', 'UTC-11:00'),
('Pacific/Norfolk', 'UTC+11:00'),
('Pacific/Noumea', 'UTC+11:00'),
('Pacific/Pago_Pago', 'UTC-11:00'),
('Pacific/Palau', 'UTC+09:00'),
('Pacific/Pitcairn', 'UTC-08:00'),
('Pacific/Pohnpei', 'UTC+11:00'),
('Pacific/Port_Moresby', 'UTC+10:00'),
('Pacific/Rarotonga', 'UTC-10:00'),
('Pacific/Saipan', 'UTC+10:00'),
('Pacific/Tahiti', 'UTC-10:00'),
('Pacific/Tarawa', 'UTC+12:00'),
('Pacific/Tongatapu', 'UTC+13:00'),
('Pacific/Wake', 'UTC+12:00'),
('Pacific/Wallis', 'UTC+12:00'),
('UTC', 'UTC+00:00')
ON CONFLICT (timezone) DO NOTHING;


UPDATE geonames SET timezone_utc=t.timezone_utc FROM time_zones t WHERE t.timezone=geonames.timezone;


ALTER TABLE experiences 
  ADD COLUMN country text,
  ADD COLUMN city text,
  ADD COLUMN employment_type employment_type,
  ADD COLUMN job_category_id uuid;

  ALTER TABLE experiences ADD CONSTRAINT fk_job_category FOREIGN KEY (job_category_id) REFERENCES job_categories(id);
ALTER TABLE projects ADD COLUMN impact_job boolean DEFAULT true;

CREATE OR REPLACE FUNCTION active_by_impact_job()
RETURNS TRIGGER AS
$$
BEGIN
  IF NEW.impact_job = FALSE THEN
    NEW.status := 'EXPIRE';
  END IF;
  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;


CREATE TRIGGER update_project_on_impact
    BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION active_by_impact_job();

CREATE TRIGGER insert_project_on_impact
    BEFORE INSERT ON projects FOR EACH ROW EXECUTE FUNCTION active_by_impact_job();
ALTER TABLE projects ADD COLUMN promoted boolean default false;
ALTER TABLE organizations ADD COLUMN did text;



CREATE TABLE experience_credentials (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  status experience_credentials_status DEFAULT 'PENDING' NOT NULL,
  user_id uuid NOT NULL,
  org_id uuid NOT NULL,
  experience_id uuid UNIQUE NOT NULL,
  connection_id text,
  connection_url text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_org FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_experience FOREIGN KEY (experience_id) REFERENCES experiences(id) ON DELETE CASCADE
);
ALTER TABLE experience_credentials ADD COLUMN message text;
ALTER TYPE  experience_credentials_status ADD VALUE 'REJECTED';
ALTER TABLE users ADD COLUMN identity_verified boolean DEFAULT false;

CREATE TABLE IF NOT EXISTS referrings (
  referred_identity_id uuid PRIMARY KEY NOT NULL REFERENCES identities(id),
  referred_by_id uuid NOT NULL REFERENCES identities(id),
  created_at timestamptz DEFAULT now() NOT NULL
);

DELETE FROM identities WHERE 
  NOT EXISTS (
      SELECT 1
      FROM users
      WHERE users.id = identities.id
  ) AND NOT EXISTS (
    SELECT 1
      FROM organizations
      WHERE organizations.id = identities.id
  );

  DROP TRIGGER IF EXISTS delete_identity ON organizations;
  DROP TRIGGER IF EXISTS delete_identity ON users;

CREATE TRIGGER delete_identity
    AFTER DELETE ON organizations FOR EACH ROW EXECUTE FUNCTION delete_identity();


CREATE TRIGGER delete_identity
    AFTER DELETE ON users FOR EACH ROW EXECUTE FUNCTION delete_identity();
ALTER TABLE organizations ADD COLUMN verified boolean default false;



CREATE TABLE verification_credentials (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  status experience_credentials_status DEFAULT 'PENDING' NOT NULL,
  identity_id uuid NOT NULL UNIQUE,
  connection_id text UNIQUE,
  connection_url text,
  present_id text UNIQUE,
  body jsonb,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE CASCADE
);




CREATE OR REPLACE FUNCTION approved_verification()
  RETURNS TRIGGER AS
$$
DECLARE meta_data JSON;
BEGIN
  RAISE NOTICE 'Identity verfication has been approved';
  UPDATE users SET identity_verified = true WHERE id=NEW.identity_id;
  UPDATE organizations SET verified = true WHERE id=NEW.identity_id;
  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;


CREATE TRIGGER verfication_update
    AFTER INSERT OR UPDATE ON verification_credentials
    FOR EACH ROW WHEN (NEW.status = 'APPROVED')
    EXECUTE FUNCTION approved_verification();
CREATE OR REPLACE FUNCTION set_orgs_identity()
  RETURNS TRIGGER AS
$$
DECLARE meta_data JSON;
BEGIN
  meta_data := (SELECT row_to_json(t) FROM (
    SELECT 
      o.id,
      shortname,
      name,
      description,
      mission,
      email,
      m.url AS image,
      status,
      country,
      city,
      address,
      verified,
      verified_impact,
      wallet_address,
      hiring
    FROM organizations o
    LEFT JOIN media m ON m.id=o.image
    ) t WHERE id = NEW.id);
    
  INSERT INTO identities (id, type, meta)  VALUES (NEW.id, 'organizations', meta_data) ON CONFLICT (id) DO UPDATE SET meta=meta_data;
  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;



CREATE OR REPLACE FUNCTION set_users_identity()
  RETURNS TRIGGER AS
$$
DECLARE meta_data JSON;
BEGIN
  meta_data := (SELECT row_to_json(t) FROM (
    SELECT 
      users.id,
      username,
      email,
      (NEW.first_name || ' ' || NEW.last_name) AS name,
      m.url AS avatar,
      status,
      country,
      city,
      address,
      wallet_address,
      open_to_work,
      open_to_volunteer,
      identity_verified
    FROM users
    LEFT JOIN media m ON m.id=users.avatar
    ) t WHERE id = NEW.id);
    
  INSERT INTO identities (id, type, meta)  VALUES (NEW.id, 'users', meta_data) ON CONFLICT (id) DO UPDATE SET meta=meta_data;
  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;


UPDATE organizations SET id=id;
UPDATE users SET id=id;


ALTER TYPE notification_type ADD VALUE 'REFERRAL_JOINED';
ALTER TYPE notification_type ADD VALUE 'REFERRAL_VERIFIED';
ALTER TYPE notification_type ADD VALUE 'REFERRAL_HIRED';
ALTER TYPE notification_type ADD VALUE 'REFERRAL_COMPLETED_JOB';
ALTER TYPE notification_type ADD VALUE 'REFERRAL_CONFIRMED_JOB';

ALTER TYPE notification_type ADD VALUE 'EXPERIENCE_VERIFY_REQUEST';
ALTER TYPE notification_type ADD VALUE 'EXPERIENCE_VERIFY_APPROVED';
ALTER TYPE notification_type ADD VALUE 'EXPERIENCE_VERIFY_REJECTED';

ALTER TYPE notification_type ADD VALUE 'EXPERIENCE_ISSUED';
ALTER TYPE notification_type ADD VALUE 'EXPERIENCE_ISSUED_APPROVED';
ALTER TYPE notification_type ADD VALUE 'EXPERIENCE_ISSUED_REJECTED';
ALTER TABLE experience_credentials ADD COLUMN exact_info boolean default true;
ALTER TABLE experiences ADD COLUMN weekly_hours int;
/* Replace with your SQL commands */
ALTER TYPE experience_credentials_status ADD VALUE 'ISSUED';
ALTER TABLE payments 
ADD COLUMN referrers_fee boolean default false;
ALTER TABLE payments ADD COLUMN ref_trx uuid;
CREATE TABLE educations (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  user_id uuid NOT NULL,
  org_id uuid NOT NULL,
  title text,
  description text,
  grade text,
  degree text,
  start_at timestamp NOT NULL,
  end_at timestamp,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_org FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);





CREATE TABLE educations_credentials (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  status educations_credentials_status DEFAULT 'PENDING' NOT NULL,
  user_id uuid NOT NULL,
  org_id uuid NOT NULL,
  education_id uuid UNIQUE NOT NULL,
  message text,
  connection_id text,
  connection_url text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_org FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_education FOREIGN KEY (education_id) REFERENCES educations(id) ON DELETE CASCADE
);
/* Replace with your SQL commands */
CREATE TABLE org_verification_credentials (
  id                  uuid                            NOT NULL DEFAULT public.uuid_generate_v4() PRIMARY KEY,
  identity_id         uuid                            NOT NULL UNIQUE,
  status              verification_credentials_status NOT NULL DEFAULT 'PENDING',
  created_at          timestamp with time zone        NOT NULL DEFAULT now(),
  updated_at          timestamp with time zone        NOT NULL DEFAULT now(),
  CONSTRAINT          fk_identity FOREIGN KEY (identity_id) REFERENCES identities(id) ON DELETE CASCADE
);

CREATE TABLE org_verification_documents (
  id                   uuid                            NOT NULL DEFAULT public.uuid_generate_v4() PRIMARY KEY,
  media_id             uuid                            NOT NULL UNIQUE,
  verification_id      uuid                            NOT NULL,
  created_at           timestamp with time zone        NOT NULL DEFAULT now(),
  updated_at           timestamp with time zone        NOT NULL DEFAULT now(),
  CONSTRAINT fk_org_verification_credentials FOREIGN KEY (verification_id) REFERENCES org_verification_credentials(id) ON DELETE CASCADE
);
ALTER TYPE notification_type ADD VALUE 'EDUCATION_VERIFY_REQUEST';
ALTER TYPE notification_type ADD VALUE 'EDUCATION_VERIFY_APPROVED';
ALTER TYPE notification_type ADD VALUE 'EDUCATION_VERIFY_REJECTED';

ALTER TYPE notification_type ADD VALUE 'EDUCATION_ISSUED';
ALTER TYPE notification_type ADD VALUE 'EDUCATION_ISSUED_APPROVED';
ALTER TYPE notification_type ADD VALUE 'EDUCATION_ISSUED_REJECTED';
/* Replace with your SQL commands *//* Replace with your SQL commands */
CREATE TABLE verification_documents (
  id                   uuid                            NOT NULL DEFAULT public.uuid_generate_v4() PRIMARY KEY,
  media_id             uuid                            NOT NULL UNIQUE,
  verification_id      uuid                            NOT NULL,
  created_at           timestamp with time zone        NOT NULL DEFAULT now(),
  updated_at           timestamp with time zone        NOT NULL DEFAULT now(),
  CONSTRAINT fk_verification_credentials FOREIGN KEY (verification_id) REFERENCES verification_credentials(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS org_verification_documents CASCADE;
DROP TABLE IF EXISTS org_verification_credentials CASCADE;
