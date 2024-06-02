--
-- PostgreSQL database dump
--

-- Dumped from database version 14.4
-- Dumped by pg_dump version 14.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: additional_type; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.additional_type AS ENUM (
    'PORTFOLIO',
    'CERTIFICATE',
    'EDUCATION',
    'BENEFIT',
    'RECOMMENDATIONS'
);


ALTER TYPE public.additional_type OWNER TO socious;

--
-- Name: applicants_status_type; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.applicants_status_type AS ENUM (
    'PENDING',
    'OFFERED',
    'REJECTED',
    'WITHDRAWN',
    'APPROVED',
    'HIRED',
    'CLOSED'
);


ALTER TYPE public.applicants_status_type OWNER TO socious;

--
-- Name: chat_member_type; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.chat_member_type AS ENUM (
    'MEMBER',
    'ADMIN'
);


ALTER TYPE public.chat_member_type OWNER TO socious;

--
-- Name: chat_type; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.chat_type AS ENUM (
    'CHAT',
    'GROUPED',
    'CHANNEL'
);


ALTER TYPE public.chat_type OWNER TO socious;

--
-- Name: collector_jobs_services; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.collector_jobs_services AS ENUM (
    'IDEALIST',
    'RELIEFWEB'
);


ALTER TYPE public.collector_jobs_services OWNER TO socious;

--
-- Name: connect_status; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.connect_status AS ENUM (
    'PENDING',
    'CONNECTED',
    'BLOCKED'
);


ALTER TYPE public.connect_status OWNER TO socious;

--
-- Name: dispute_event_type; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.dispute_event_type AS ENUM (
    'MESSAGE',
    'RESPONSE',
    'WITHDRAW',
    'VOTE'
);


ALTER TYPE public.dispute_event_type OWNER TO socious;

--
-- Name: dispute_state; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.dispute_state AS ENUM (
    'AWAITING_RESPONSE',
    'PENDING_REVIEW',
    'WITHDRAWN',
    'RESOLVED'
);


ALTER TYPE public.dispute_state OWNER TO socious;

--
-- Name: educations_credentials_status; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.educations_credentials_status AS ENUM (
    'PENDING',
    'APPROVED',
    'SENT',
    'CLAIMED',
    'ISSUED',
    'REJECTED'
);


ALTER TYPE public.educations_credentials_status OWNER TO socious;

--
-- Name: email_service_type; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.email_service_type AS ENUM (
    'SMTP',
    'SENDGRID',
    'TEST'
);


ALTER TYPE public.email_service_type OWNER TO socious;

--
-- Name: employment_type; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.employment_type AS ENUM (
    'ONE_OFF',
    'PART_TIME',
    'FULL_TIME'
);


ALTER TYPE public.employment_type OWNER TO socious;

--
-- Name: entity_type; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.entity_type AS ENUM (
    'users',
    'organizations',
    'projects'
);


ALTER TYPE public.entity_type OWNER TO socious;

--
-- Name: experience_credentials_status; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.experience_credentials_status AS ENUM (
    'PENDING',
    'APPROVED',
    'SENT',
    'CLAIMED',
    'REJECTED',
    'ISSUED'
);


ALTER TYPE public.experience_credentials_status OWNER TO socious;

--
-- Name: identity_type; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.identity_type AS ENUM (
    'users',
    'organizations'
);


ALTER TYPE public.identity_type OWNER TO socious;

--
-- Name: language_level; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.language_level AS ENUM (
    'BASIC',
    'CONVERSANT',
    'PROFICIENT',
    'FLUENT',
    'NATIVE'
);


ALTER TYPE public.language_level OWNER TO socious;

--
-- Name: mission_status; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.mission_status AS ENUM (
    'ACTIVE',
    'COMPLETE',
    'CONFIRMED',
    'CANCELED',
    'KICKED_OUT'
);


ALTER TYPE public.mission_status OWNER TO socious;

--
-- Name: notification_type; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.notification_type AS ENUM (
    'FOLLOWED',
    'COMMENT_LIKE',
    'POST_LIKE',
    'CHAT',
    'SHARE_POST',
    'SHARE_PROJECT',
    'COMMENT',
    'APPLICATION',
    'OFFER',
    'REJECT',
    'APPROVED',
    'HIRED',
    'PROJECT_COMPLETE',
    'EMPLOYEE_CANCELED',
    'EMPLOYER_CANCELED',
    'EMPLOYER_CONFIRMED',
    'ASSIGNEE_CANCELED',
    'ASSIGNER_CANCELED',
    'ASSIGNER_CONFIRMED',
    'CONNECT',
    'MEMBERED',
    'ACCEPT_CONNECT',
    'REFERRAL_JOINED',
    'REFERRAL_VERIFIED',
    'REFERRAL_HIRED',
    'REFERRAL_COMPLETED_JOB',
    'REFERRAL_CONFIRMED_JOB',
    'EXPERIENCE_VERIFY_REQUEST',
    'EXPERIENCE_VERIFY_APPROVED',
    'EXPERIENCE_VERIFY_REJECTED',
    'EXPERIENCE_ISSUED',
    'EXPERIENCE_ISSUED_APPROVED',
    'EXPERIENCE_ISSUED_REJECTED',
    'EDUCATION_VERIFY_REQUEST',
    'EDUCATION_VERIFY_APPROVED',
    'EDUCATION_VERIFY_REJECTED',
    'EDUCATION_ISSUED',
    'EDUCATION_ISSUED_APPROVED',
    'EDUCATION_ISSUED_REJECTED',
    'DISPUTE_INITIATED',
    'DISPUTE_NEW_RESPONSE',
    'DISPUTE_NEW_MESSAGE',
    'DISPUTE_WITHDRAWN'
);


ALTER TYPE public.notification_type OWNER TO socious;

--
-- Name: oauth_connected_providers; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.oauth_connected_providers AS ENUM (
    'STRIPE',
    'STRIPE_JP'
);


ALTER TYPE public.oauth_connected_providers OWNER TO socious;

--
-- Name: offers_status_type; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.offers_status_type AS ENUM (
    'PENDING',
    'WITHDRAWN',
    'APPROVED',
    'HIRED',
    'CLOSED',
    'CANCELED'
);


ALTER TYPE public.offers_status_type OWNER TO socious;

--
-- Name: org_size; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.org_size AS ENUM (
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I'
);


ALTER TYPE public.org_size OWNER TO socious;

--
-- Name: org_status; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.org_status AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'SUSPEND'
);


ALTER TYPE public.org_status OWNER TO socious;

--
-- Name: organization_type; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.organization_type AS ENUM (
    'SOCIAL',
    'NONPROFIT',
    'COOP',
    'IIF',
    'PUBLIC',
    'INTERGOV',
    'DEPARTMENT',
    'OTHER',
    'STARTUP',
    'EDUCATIONAL',
    'HEALTHCARE',
    'RELIGIOUS',
    'COMMERCIAL'
);


ALTER TYPE public.organization_type OWNER TO socious;

--
-- Name: otp_purpose; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.otp_purpose AS ENUM (
    'AUTH',
    'FORGET_PASSWORD',
    'ACTIVATION'
);


ALTER TYPE public.otp_purpose OWNER TO socious;

--
-- Name: otp_type; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.otp_type AS ENUM (
    'EMAIL',
    'PHONE'
);


ALTER TYPE public.otp_type OWNER TO socious;

--
-- Name: payment_currency; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.payment_currency AS ENUM (
    'USD',
    'RWF',
    'AUD',
    'BDT',
    'GTQ',
    'INR',
    'CHF',
    'MXN',
    'CAD',
    'DOP',
    'KRW',
    'EUR',
    'ZAR',
    'NPR',
    'COP',
    'UYU',
    'CRC',
    'JPY',
    'GBP',
    'ARS',
    'GHS',
    'PEN',
    'DKK',
    'BRL',
    'CLP',
    'EGP',
    'THB'
);


ALTER TYPE public.payment_currency OWNER TO socious;

--
-- Name: payment_mode_type; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.payment_mode_type AS ENUM (
    'CRYPTO',
    'FIAT'
);


ALTER TYPE public.payment_mode_type OWNER TO socious;

--
-- Name: payment_scheme; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.payment_scheme AS ENUM (
    'HOURLY',
    'FIXED'
);


ALTER TYPE public.payment_scheme OWNER TO socious;

--
-- Name: payment_service; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.payment_service AS ENUM (
    'STRIPE',
    'CRYPTO'
);


ALTER TYPE public.payment_service OWNER TO socious;

--
-- Name: payment_source_type; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.payment_source_type AS ENUM (
    'CARD',
    'CRYPTO_WALLET'
);


ALTER TYPE public.payment_source_type OWNER TO socious;

--
-- Name: payment_type; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.payment_type AS ENUM (
    'VOLUNTEER',
    'PAID'
);


ALTER TYPE public.payment_type OWNER TO socious;

--
-- Name: project_length; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.project_length AS ENUM (
    'LESS_THAN_A_DAY',
    'LESS_THAN_A_MONTH',
    '1_3_MONTHS',
    '3_6_MONTHS',
    '6_MONTHS_OR_MORE'
);


ALTER TYPE public.project_length OWNER TO socious;

--
-- Name: project_mark_type; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.project_mark_type AS ENUM (
    'SAVE',
    'NOT_INTERESTED'
);


ALTER TYPE public.project_mark_type OWNER TO socious;

--
-- Name: project_remote_preference_type; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.project_remote_preference_type AS ENUM (
    'ONSITE',
    'REMOTE',
    'HYBRID'
);


ALTER TYPE public.project_remote_preference_type OWNER TO socious;

--
-- Name: project_remote_preference_type_old; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.project_remote_preference_type_old AS ENUM (
    'ONSITE',
    'REMOOTE',
    'HYBRID'
);


ALTER TYPE public.project_remote_preference_type_old OWNER TO socious;

--
-- Name: project_status; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.project_status AS ENUM (
    'DRAFT',
    'EXPIRE',
    'ACTIVE'
);


ALTER TYPE public.project_status OWNER TO socious;

--
-- Name: project_type; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.project_type AS ENUM (
    'ONE_OFF',
    'PART_TIME',
    'FULL_TIME'
);


ALTER TYPE public.project_type OWNER TO socious;

--
-- Name: sdg_type; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.sdg_type AS ENUM (
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


ALTER TYPE public.sdg_type OWNER TO socious;

--
-- Name: social_causes_categories_type; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.social_causes_categories_type AS ENUM (
    'PEOPLE_RELATED',
    'ANIMAL_RELATED',
    'COMMUNITIES_RELATED',
    'PLANET_RELATED'
);


ALTER TYPE public.social_causes_categories_type OWNER TO socious;

--
-- Name: social_causes_type; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.social_causes_type AS ENUM (
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
    'ANTI_SEMITISM',
    'ABORTION',
    'EUTHANASIA',
    'NEURODIVERSITY',
    'SUSTAINABLE_COMMUNITIES',
    'BIODIVERSITY_LIFE_BELOW_WATER',
    'PEACE_JUSTICE',
    'COLLABORATION_FOR_IMPACT',
    'INNOVATION'
);


ALTER TYPE public.social_causes_type OWNER TO socious;

--
-- Name: submit_works_status_type; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.submit_works_status_type AS ENUM (
    'PENDING',
    'CONFIRMED'
);


ALTER TYPE public.submit_works_status_type OWNER TO socious;

--
-- Name: token_type; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.token_type AS ENUM (
    'JWT_ACCESS',
    'JWT_REFRESH'
);


ALTER TYPE public.token_type OWNER TO socious;

--
-- Name: topup_status; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.topup_status AS ENUM (
    'WAITING',
    'COMPLETE'
);


ALTER TYPE public.topup_status OWNER TO socious;

--
-- Name: user_status; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.user_status AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'SUSPEND'
);


ALTER TYPE public.user_status OWNER TO socious;

--
-- Name: verification_credentials_status; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.verification_credentials_status AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);


ALTER TYPE public.verification_credentials_status OWNER TO socious;

--
-- Name: vote_side_type; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.vote_side_type AS ENUM (
    'CLAIMANT',
    'RESPONDENT'
);


ALTER TYPE public.vote_side_type OWNER TO socious;

--
-- Name: webhook_party_type; Type: TYPE; Schema: public; Owner: socious
--

CREATE TYPE public.webhook_party_type AS ENUM (
    'PROOFSPACE'
);


ALTER TYPE public.webhook_party_type OWNER TO socious;

--
-- Name: active_by_impact_job(); Type: FUNCTION; Schema: public; Owner: socious
--

CREATE FUNCTION public.active_by_impact_job() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.impact_job = FALSE THEN
    NEW.status := 'EXPIRE';
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.active_by_impact_job() OWNER TO socious;

--
-- Name: applicant_tsv(); Type: FUNCTION; Schema: public; Owner: socious
--

CREATE FUNCTION public.applicant_tsv() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN   
  NEW.search_tsv := to_tsvector(
    'english', 
    (SELECT concat_ws(' ', username, first_name, last_name) FROM users WHERE id=NEW.user_id)
  );
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.applicant_tsv() OWNER TO socious;

--
-- Name: approved_verification(); Type: FUNCTION; Schema: public; Owner: socious
--

CREATE FUNCTION public.approved_verification() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE meta_data JSON;
BEGIN
  RAISE NOTICE 'Identity verfication has been approved';
  UPDATE users SET identity_verified = true WHERE id=NEW.identity_id;
  UPDATE organizations SET verified = true WHERE id=NEW.identity_id;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.approved_verification() OWNER TO socious;

--
-- Name: cleaner(); Type: FUNCTION; Schema: public; Owner: socious
--

CREATE FUNCTION public.cleaner() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  DELETE FROM tokens_blacklist WHERE expires_at < CURRENT_TIMESTAMP;
  RETURN NULL;
END;
$$;


ALTER FUNCTION public.cleaner() OWNER TO socious;

--
-- Name: del_post(); Type: FUNCTION; Schema: public; Owner: socious
--

CREATE FUNCTION public.del_post() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF OLD.shared_id IS NOT NULL THEN
    UPDATE posts SET shared = shared - 1 WHERE id=OLD.shared_id;
  END IF;
  RETURN OLD;
END;
$$;


ALTER FUNCTION public.del_post() OWNER TO socious;

--
-- Name: delete_identity(); Type: FUNCTION; Schema: public; Owner: socious
--

CREATE FUNCTION public.delete_identity() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  DELETE FROM identities WHERE id=OLD.id;
  RETURN OLD;
END;
$$;


ALTER FUNCTION public.delete_identity() OWNER TO socious;

--
-- Name: follow_on_connect(); Type: FUNCTION; Schema: public; Owner: socious
--

CREATE FUNCTION public.follow_on_connect() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.follow_on_connect() OWNER TO socious;

--
-- Name: followed(); Type: FUNCTION; Schema: public; Owner: socious
--

CREATE FUNCTION public.followed() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE users SET followers=followers+1 FROM identities i WHERE users.id=NEW.following_identity_id AND users.id=i.id AND i.type='users';
  UPDATE users SET followings=followings+1 FROM identities i WHERE users.id=NEW.follower_identity_id AND users.id=i.id AND i.type='users';
  UPDATE organizations SET followers=followers+1 FROM identities i WHERE organizations.id=NEW.following_identity_id AND organizations.id=i.id AND i.type='organizations';
  UPDATE organizations SET followings=followings+1 FROM identities i WHERE organizations.id=NEW.follower_identity_id AND organizations.id=i.id AND i.type='organizations';
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.followed() OWNER TO socious;

--
-- Name: generate_relation(); Type: FUNCTION; Schema: public; Owner: socious
--

CREATE FUNCTION public.generate_relation() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN  
  NEW.relation_id := (SELECT array_to_string(array_agg(a), '-', '')
    FROM (
      SELECT unnest(array[NEW.requested_id::text, NEW.requester_id::text]) as a 
      ORDER BY a) s
  );
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.generate_relation() OWNER TO socious;

--
-- Name: liked(); Type: FUNCTION; Schema: public; Owner: socious
--

CREATE FUNCTION public.liked() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE posts SET likes = likes + 1 WHERE id=NEW.post_id AND NEW.comment_id IS NULL;
  UPDATE comments SET likes = likes + 1 WHERE id=NEW.comment_id AND NEW.comment_id IS NOT NULL;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.liked() OWNER TO socious;

--
-- Name: make_shotname_lowercase(); Type: FUNCTION; Schema: public; Owner: socious
--

CREATE FUNCTION public.make_shotname_lowercase() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.make_shotname_lowercase() OWNER TO socious;

--
-- Name: missions_status(); Type: FUNCTION; Schema: public; Owner: socious
--

CREATE FUNCTION public.missions_status() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.status <> 'ACTIVE' THEN
    UPDATE applicants SET status = 'CLOSED' WHERE id=NEW.applicant_id;
    UPDATE offers SET status = 'CLOSED' WHERE id=NEW.offer_id;
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.missions_status() OWNER TO socious;

--
-- Name: new_chat(); Type: FUNCTION; Schema: public; Owner: socious
--

CREATE FUNCTION public.new_chat() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO chats_participants (identity_id, chat_id, type, joined_by)
  VALUES(NEW.created_by, NEW.id, 'ADMIN', NEW.created_by);
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.new_chat() OWNER TO socious;

--
-- Name: new_comment(); Type: FUNCTION; Schema: public; Owner: socious
--

CREATE FUNCTION public.new_comment() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE posts SET comments = comments + 1 WHERE id=NEW.post_id AND NEW.reply_id IS NULL;
  IF NEW.reply_id IS NOT NULL THEN
    UPDATE comments SET replied=true WHERE id=NEW.reply_id;
  END IF;

  RETURN NEW;
END;
$$;


ALTER FUNCTION public.new_comment() OWNER TO socious;

--
-- Name: new_message(); Type: FUNCTION; Schema: public; Owner: socious
--

CREATE FUNCTION public.new_message() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  
  IF NEW.reply_id IS NOT NULL THEN
    UPDATE messages SET replied=true WHERE id=NEW.reply_id;
  END IF;

  UPDATE chats SET updated_at=now() WHERE id=NEW.chat_id;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.new_message() OWNER TO socious;

--
-- Name: new_orgs(); Type: FUNCTION; Schema: public; Owner: socious
--

CREATE FUNCTION public.new_orgs() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.created_by IS NOT NULL THEN
    INSERT INTO follows (follower_identity_id, following_identity_id) 
      VALUES (NEW.created_by, NEW.id);
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.new_orgs() OWNER TO socious;

--
-- Name: new_post(); Type: FUNCTION; Schema: public; Owner: socious
--

CREATE FUNCTION public.new_post() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.shared_id IS NOT NULL THEN
    UPDATE posts SET shared = shared + 1 WHERE id=NEW.shared_id;
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.new_post() OWNER TO socious;

--
-- Name: not_interest(); Type: FUNCTION; Schema: public; Owner: socious
--

CREATE FUNCTION public.not_interest() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.marked_as = 'NOT_INTERESTED' THEN
    UPDATE recommends SET is_active=false WHERE identity_id=NEW.identity_id AND entity_id=NEW.project_id;
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.not_interest() OWNER TO socious;

--
-- Name: org_tsv(); Type: FUNCTION; Schema: public; Owner: socious
--

CREATE FUNCTION public.org_tsv() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.org_tsv() OWNER TO socious;

--
-- Name: post_tsv(); Type: FUNCTION; Schema: public; Owner: socious
--

CREATE FUNCTION public.post_tsv() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.post_tsv() OWNER TO socious;

--
-- Name: project_tsv(); Type: FUNCTION; Schema: public; Owner: socious
--

CREATE FUNCTION public.project_tsv() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.project_tsv() OWNER TO socious;

--
-- Name: remove_comment(); Type: FUNCTION; Schema: public; Owner: socious
--

CREATE FUNCTION public.remove_comment() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE posts SET comments = comments - 1 WHERE id=OLD.post_id;
  RETURN OLD;
END;
$$;


ALTER FUNCTION public.remove_comment() OWNER TO socious;

--
-- Name: set_orgs_identity(); Type: FUNCTION; Schema: public; Owner: socious
--

CREATE FUNCTION public.set_orgs_identity() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.set_orgs_identity() OWNER TO socious;

--
-- Name: set_users_identity(); Type: FUNCTION; Schema: public; Owner: socious
--

CREATE FUNCTION public.set_users_identity() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.set_users_identity() OWNER TO socious;

--
-- Name: unfollowed(); Type: FUNCTION; Schema: public; Owner: socious
--

CREATE FUNCTION public.unfollowed() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE users SET followers=followers-1 FROM identities i WHERE users.id=OLD.following_identity_id AND users.id=i.id AND i.type='users';
  UPDATE users SET followings=followings-1 FROM identities i WHERE users.id=OLD.follower_identity_id AND users.id=i.id AND i.type='users';
  UPDATE organizations SET followers=followers-1 FROM identities i WHERE organizations.id=OLD.following_identity_id AND organizations.id=i.id AND i.type='organizations';
  UPDATE organizations SET followings=followings-1 FROM identities i WHERE organizations.id=OLD.follower_identity_id AND organizations.id=i.id AND i.type='organizations';
  RETURN OLD;
END;
$$;


ALTER FUNCTION public.unfollowed() OWNER TO socious;

--
-- Name: unliked(); Type: FUNCTION; Schema: public; Owner: socious
--

CREATE FUNCTION public.unliked() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE posts SET likes = likes - 1 WHERE id=OLD.post_id AND OLD.comment_id IS NULL and likes > 0;
  UPDATE comments SET likes = likes - 1 WHERE id=NEW.comment_id AND OLD.comment_id IS NOT NULL and likes > 0;
  RETURN OLD;
END;
$$;


ALTER FUNCTION public.unliked() OWNER TO socious;

--
-- Name: update_user_impact_points(); Type: FUNCTION; Schema: public; Owner: socious
--

CREATE FUNCTION public.update_user_impact_points() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE users SET impact_points = impact_points + NEW.total_points WHERE id=NEW.identity_id;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_user_impact_points() OWNER TO socious;

--
-- Name: user_tsv(); Type: FUNCTION; Schema: public; Owner: socious
--

CREATE FUNCTION public.user_tsv() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.user_tsv() OWNER TO socious;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: additionals; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.additionals (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    type public.additional_type NOT NULL,
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
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.additionals OWNER TO socious;

--
-- Name: answers; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.answers (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    project_id uuid NOT NULL,
    question_id uuid NOT NULL,
    applicant_id uuid NOT NULL,
    answer text,
    selected_option integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.answers OWNER TO socious;

--
-- Name: applicants; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.applicants (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    project_id uuid NOT NULL,
    user_id uuid NOT NULL,
    cover_letter text,
    payment_rate integer,
    offer_rate double precision,
    offer_message character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    feedback text,
    status public.applicants_status_type DEFAULT 'PENDING'::public.applicants_status_type,
    payment_type public.payment_type DEFAULT 'PAID'::public.payment_type,
    old_id integer,
    cv_link text,
    cv_name character varying(128),
    share_contact_info boolean,
    attachment uuid,
    closed_at timestamp without time zone,
    search_tsv tsvector
);


ALTER TABLE public.applicants OWNER TO socious;

--
-- Name: cards; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.cards (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    identity_id uuid NOT NULL,
    holder_name text,
    brand character varying(25),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    meta jsonb,
    customer text,
    is_jp boolean DEFAULT false
);


ALTER TABLE public.cards OWNER TO socious;

--
-- Name: chats; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.chats (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name text NOT NULL,
    description text,
    type public.chat_type DEFAULT 'CHAT'::public.chat_type NOT NULL,
    created_by uuid NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    participants uuid[],
    old_id integer
);


ALTER TABLE public.chats OWNER TO socious;

--
-- Name: chats_participants; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.chats_participants (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    identity_id uuid NOT NULL,
    chat_id uuid NOT NULL,
    type public.chat_member_type DEFAULT 'MEMBER'::public.chat_member_type,
    muted_until timestamp without time zone,
    joined_by uuid,
    last_read_id uuid,
    all_read boolean DEFAULT false,
    last_read_at timestamp without time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.chats_participants OWNER TO socious;

--
-- Name: collector_jobs; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.collector_jobs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    service public.collector_jobs_services NOT NULL,
    job_name character varying(250) NOT NULL,
    has_more boolean DEFAULT false,
    fetch_counter integer DEFAULT 1,
    last_modified_date timestamp without time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.collector_jobs OWNER TO socious;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.comments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    identity_id uuid NOT NULL,
    post_id uuid NOT NULL,
    content text NOT NULL,
    reply_id uuid,
    replied boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    likes integer DEFAULT 0,
    media_id uuid
);


ALTER TABLE public.comments OWNER TO socious;

--
-- Name: connections; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.connections (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    status public.connect_status DEFAULT 'PENDING'::public.connect_status NOT NULL,
    text text,
    requester_id uuid NOT NULL,
    requested_id uuid NOT NULL,
    connected_at timestamp without time zone,
    relation_id character varying(255) NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.connections OWNER TO socious;

--
-- Name: country_lookup; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.country_lookup (
    country_code character(2),
    country_name text
);


ALTER TABLE public.country_lookup OWNER TO socious;

--
-- Name: deleted_users; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.deleted_users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    username character varying(200),
    reason text,
    registered_at timestamp without time zone NOT NULL,
    deleted_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.deleted_users OWNER TO socious;

--
-- Name: devices; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.devices (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    token text NOT NULL,
    meta jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.devices OWNER TO socious;

--
-- Name: dispute_code; Type: SEQUENCE; Schema: public; Owner: socious
--

CREATE SEQUENCE public.dispute_code
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.dispute_code OWNER TO socious;

--
-- Name: dispute_events; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.dispute_events (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    message text,
    type public.dispute_event_type DEFAULT 'MESSAGE'::public.dispute_event_type NOT NULL,
    dispute_id uuid NOT NULL,
    identity_id uuid NOT NULL,
    vote_side public.vote_side_type,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.dispute_events OWNER TO socious;

--
-- Name: dispute_evidences; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.dispute_evidences (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    identity_id uuid NOT NULL,
    dispute_id uuid NOT NULL,
    dispute_event_id uuid NOT NULL,
    media_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.dispute_evidences OWNER TO socious;

--
-- Name: disputes; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.disputes (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title text NOT NULL,
    code text DEFAULT concat('DIS-', nextval('public.dispute_code'::regclass)) NOT NULL,
    claimant_id uuid NOT NULL,
    respondent_id uuid NOT NULL,
    state public.dispute_state DEFAULT 'AWAITING_RESPONSE'::public.dispute_state NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.disputes OWNER TO socious;

--
-- Name: educations; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.educations (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    org_id uuid NOT NULL,
    title text,
    description text,
    grade text,
    degree text,
    start_at timestamp without time zone NOT NULL,
    end_at timestamp without time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.educations OWNER TO socious;

--
-- Name: educations_credentials; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.educations_credentials (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    status public.educations_credentials_status DEFAULT 'PENDING'::public.educations_credentials_status NOT NULL,
    user_id uuid NOT NULL,
    org_id uuid NOT NULL,
    education_id uuid NOT NULL,
    message text,
    connection_id text,
    connection_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.educations_credentials OWNER TO socious;

--
-- Name: emails; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.emails (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    options jsonb,
    info jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    "to" text NOT NULL,
    subject text NOT NULL,
    body text NOT NULL,
    body_type text NOT NULL,
    service public.email_service_type NOT NULL
);


ALTER TABLE public.emails OWNER TO socious;

--
-- Name: emojis; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.emojis (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    identity_id uuid NOT NULL,
    comment_id uuid,
    post_id uuid NOT NULL,
    emoji character varying(8) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.emojis OWNER TO socious;

--
-- Name: escrows; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.escrows (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    project_id uuid NOT NULL,
    payment_id uuid NOT NULL,
    amount double precision,
    currency public.payment_currency,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    released_at timestamp without time zone,
    refound_at timestamp without time zone,
    release_id text,
    mission_id uuid,
    offer_id uuid
);


ALTER TABLE public.escrows OWNER TO socious;

--
-- Name: experience_credentials; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.experience_credentials (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    status public.experience_credentials_status DEFAULT 'PENDING'::public.experience_credentials_status NOT NULL,
    user_id uuid NOT NULL,
    org_id uuid NOT NULL,
    experience_id uuid NOT NULL,
    connection_id text,
    connection_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    message text,
    exact_info boolean DEFAULT true
);


ALTER TABLE public.experience_credentials OWNER TO socious;

--
-- Name: experiences; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.experiences (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    org_id uuid NOT NULL,
    title text,
    description text,
    skills text[],
    start_at timestamp without time zone NOT NULL,
    end_at timestamp without time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    country text,
    city text,
    employment_type public.employment_type,
    job_category_id uuid,
    weekly_hours integer,
    total_hours integer
);


ALTER TABLE public.experiences OWNER TO socious;

--
-- Name: feedbacks; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.feedbacks (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    content text,
    is_contest boolean,
    identity_id uuid NOT NULL,
    project_id uuid NOT NULL,
    mission_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.feedbacks OWNER TO socious;

--
-- Name: follows; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.follows (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    follower_identity_id uuid NOT NULL,
    following_identity_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.follows OWNER TO socious;

--
-- Name: geonames; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.geonames (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    asciiname character varying(200) NOT NULL,
    latlong point,
    feature_class character(1),
    feature_code character varying(10),
    country_code character(2),
    cc2 character(2)[],
    admin1_code character varying(20),
    admin2_code character varying(20),
    iso_code character varying(20),
    fips_code character varying(20),
    timezone character varying(40),
    population integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at date DEFAULT now() NOT NULL,
    search_tsv tsvector,
    country_name text,
    timezone_utc character varying(50)
);


ALTER TABLE public.geonames OWNER TO socious;

--
-- Name: geonames_alt; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.geonames_alt (
    id integer NOT NULL,
    geoname_id integer NOT NULL,
    iso_language character varying(7),
    alternate_name character varying(400),
    is_preferred_name boolean,
    is_short_name boolean,
    is_colloquial boolean,
    is_historic boolean
);


ALTER TABLE public.geonames_alt OWNER TO socious;

--
-- Name: identities; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.identities (
    id uuid NOT NULL,
    type public.identity_type NOT NULL,
    meta jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.identities OWNER TO socious;

--
-- Name: impact_points_history; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.impact_points_history (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    total_points double precision DEFAULT 0 NOT NULL,
    mission_id uuid,
    identity_id uuid NOT NULL,
    social_cause public.social_causes_type,
    social_cause_category public.sdg_type,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    submitted_work_id uuid
);


ALTER TABLE public.impact_points_history OWNER TO socious;

--
-- Name: industries; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.industries (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.industries OWNER TO socious;

--
-- Name: job_categories; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.job_categories (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name text NOT NULL,
    hourly_wage_dollars double precision,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.job_categories OWNER TO socious;

--
-- Name: languages; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.languages (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(64) NOT NULL,
    level public.language_level,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.languages OWNER TO socious;

--
-- Name: likes; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.likes (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    identity_id uuid NOT NULL,
    post_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    comment_id uuid
);


ALTER TABLE public.likes OWNER TO socious;

--
-- Name: media; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.media (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    identity_id uuid NOT NULL,
    filename text,
    url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.media OWNER TO socious;

--
-- Name: messages; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.messages (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    reply_id uuid,
    chat_id uuid NOT NULL,
    identity_id uuid NOT NULL,
    text text,
    replied boolean DEFAULT false,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    media uuid
);


ALTER TABLE public.messages OWNER TO socious;

--
-- Name: migrations; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    run_on timestamp without time zone NOT NULL
);


ALTER TABLE public.migrations OWNER TO socious;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: socious
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.migrations_id_seq OWNER TO socious;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: socious
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: migrations_state; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.migrations_state (
    key character varying NOT NULL,
    value text NOT NULL,
    run_on timestamp without time zone NOT NULL
);


ALTER TABLE public.migrations_state OWNER TO socious;

--
-- Name: missions; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.missions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    assignee_id uuid NOT NULL,
    project_id uuid NOT NULL,
    applicant_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    complete_at timestamp without time zone,
    updated_at timestamp without time zone,
    assigner_id uuid NOT NULL,
    offer_id uuid NOT NULL,
    status public.mission_status DEFAULT 'ACTIVE'::public.mission_status
);


ALTER TABLE public.missions OWNER TO socious;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.notifications (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    type public.notification_type NOT NULL,
    ref_id uuid NOT NULL,
    user_id uuid NOT NULL,
    data jsonb,
    view_at timestamp without time zone,
    read_at timestamp without time zone,
    updated_at timestamp without time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    silent boolean DEFAULT false
);


ALTER TABLE public.notifications OWNER TO socious;

--
-- Name: notifications_settings; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.notifications_settings (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    type public.notification_type NOT NULL,
    email boolean DEFAULT true,
    in_app boolean DEFAULT true,
    push boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.notifications_settings OWNER TO socious;

--
-- Name: oauth_connects; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.oauth_connects (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    identity_id uuid NOT NULL,
    provider public.oauth_connected_providers NOT NULL,
    matrix_unique_id text NOT NULL,
    access_token text NOT NULL,
    refresh_token text,
    meta jsonb,
    status public.user_status DEFAULT 'ACTIVE'::public.user_status,
    expired_at timestamp without time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.oauth_connects OWNER TO socious;

--
-- Name: offers; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.offers (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    project_id uuid NOT NULL,
    recipient_id uuid NOT NULL,
    offerer_id uuid NOT NULL,
    applicant_id uuid,
    assignment_total double precision DEFAULT 0,
    offer_rate double precision DEFAULT 0,
    offer_message text,
    status public.offers_status_type DEFAULT 'PENDING'::public.offers_status_type,
    due_date timestamp without time zone,
    weekly_limit integer,
    total_hours integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    payment_mode public.payment_mode_type DEFAULT 'CRYPTO'::public.payment_mode_type,
    crypto_currency_address text,
    currency public.payment_currency DEFAULT 'USD'::public.payment_currency
);


ALTER TABLE public.offers OWNER TO socious;

--
-- Name: org_members; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.org_members (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    org_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.org_members OWNER TO socious;

--
-- Name: organizations; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.organizations (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255),
    bio text,
    description text,
    email character varying(255),
    phone character varying(255),
    city character varying(255),
    type public.organization_type DEFAULT 'OTHER'::public.organization_type,
    address text,
    website character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now(),
    social_causes public.social_causes_type[],
    followers integer DEFAULT 0,
    followings integer DEFAULT 0,
    country character varying(3),
    wallet_address text,
    impact_points double precision DEFAULT 0 NOT NULL,
    mission text,
    culture text,
    image uuid,
    cover_image uuid,
    mobile_country_code character varying(16),
    created_by uuid,
    shortname character varying(200) NOT NULL,
    old_id integer,
    status public.org_status DEFAULT 'ACTIVE'::public.org_status,
    search_tsv tsvector,
    other_party_id character varying(60),
    other_party_title character varying(250),
    other_party_url text,
    geoname_id integer,
    verified_impact boolean DEFAULT false,
    hiring boolean DEFAULT false,
    size public.org_size,
    industry text,
    did text,
    verified boolean DEFAULT false,
    impact_detected boolean DEFAULT false
);


ALTER TABLE public.organizations OWNER TO socious;

--
-- Name: otps; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.otps (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    code integer NOT NULL,
    user_id uuid,
    type public.otp_type NOT NULL,
    purpose public.otp_purpose DEFAULT 'AUTH'::public.otp_purpose NOT NULL,
    verified_at timestamp without time zone,
    expired_at timestamp with time zone DEFAULT (now() + '00:10:00'::interval) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.otps OWNER TO socious;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.payments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    identity_id uuid NOT NULL,
    transaction_id character varying(250),
    amount double precision,
    currency public.payment_currency,
    service public.payment_service,
    meta jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    verified_at timestamp without time zone,
    canceled_at timestamp without time zone,
    source text NOT NULL,
    source_type public.payment_source_type DEFAULT 'CARD'::public.payment_source_type NOT NULL,
    crypto_currency_address text,
    referrers_fee boolean DEFAULT false,
    ref_trx uuid
);


ALTER TABLE public.payments OWNER TO socious;

--
-- Name: posts; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.posts (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    content text,
    identity_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    causes_tags public.social_causes_type[],
    hashtags text[],
    identity_tags uuid[],
    media uuid[],
    likes integer DEFAULT 0 NOT NULL,
    shared integer DEFAULT 0,
    shared_id uuid,
    old_id integer,
    search_tsv tsvector,
    title text,
    comments integer DEFAULT 0
);


ALTER TABLE public.posts OWNER TO socious;

--
-- Name: project_marks; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.project_marks (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    identity_id uuid NOT NULL,
    project_id uuid NOT NULL,
    marked_as public.project_mark_type DEFAULT 'SAVE'::public.project_mark_type NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.project_marks OWNER TO socious;

--
-- Name: projects; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.projects (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    identity_id uuid NOT NULL,
    description text,
    project_type public.project_type,
    project_length public.project_length,
    payment_currency character varying(200) DEFAULT NULL::character varying,
    payment_range_lower character varying(200) DEFAULT NULL::character varying,
    payment_range_higher character varying(200) DEFAULT NULL::character varying,
    experience_level integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    status public.project_status,
    payment_type public.payment_type,
    payment_scheme public.payment_scheme DEFAULT 'FIXED'::public.payment_scheme,
    title text,
    expires_at timestamp without time zone,
    country character varying(3),
    skills text[] DEFAULT '{}'::text[],
    causes_tags public.social_causes_type[] DEFAULT '{}'::public.social_causes_type[],
    old_id integer,
    other_party_id character varying(60) DEFAULT NULL::character varying,
    other_party_title character varying(250) DEFAULT NULL::character varying,
    other_party_url text,
    remote_preference public.project_remote_preference_type,
    search_tsv tsvector,
    city character varying(250),
    weekly_hours_lower character varying(200),
    weekly_hours_higher character varying(200),
    commitment_hours_lower character varying(200),
    commitment_hours_higher character varying(200),
    geoname_id integer,
    job_category_id uuid,
    impact_job boolean DEFAULT true,
    promoted boolean DEFAULT false
);


ALTER TABLE public.projects OWNER TO socious;

--
-- Name: questions; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.questions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    project_id uuid NOT NULL,
    question text NOT NULL,
    required boolean DEFAULT false,
    options text[],
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    old_id integer
);


ALTER TABLE public.questions OWNER TO socious;

--
-- Name: recommends; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.recommends (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    identity_id uuid NOT NULL,
    entity_id uuid NOT NULL,
    entity_type public.entity_type NOT NULL,
    recommened_count integer DEFAULT 1,
    order_number integer NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.recommends OWNER TO socious;

--
-- Name: referrings; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.referrings (
    referred_identity_id uuid NOT NULL,
    referred_by_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.referrings OWNER TO socious;

--
-- Name: reports; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.reports (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    identity_id uuid NOT NULL,
    blocked boolean DEFAULT false,
    comment text NOT NULL,
    post_id uuid,
    user_id uuid,
    org_id uuid,
    comment_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.reports OWNER TO socious;

--
-- Name: search_history; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.search_history (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    identity_id uuid,
    body jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone
);


ALTER TABLE public.search_history OWNER TO socious;

--
-- Name: skills; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.skills (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.skills OWNER TO socious;

--
-- Name: submitted_works; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.submitted_works (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    status public.submit_works_status_type DEFAULT 'PENDING'::public.submit_works_status_type NOT NULL,
    project_id uuid NOT NULL,
    mission_id uuid NOT NULL,
    total_hours integer DEFAULT 0,
    start_at timestamp without time zone NOT NULL,
    end_at timestamp without time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.submitted_works OWNER TO socious;

--
-- Name: temporary_table; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.temporary_table (
    id uuid,
    identity_id uuid,
    description text,
    project_type public.project_type,
    project_length public.project_length,
    payment_currency character varying(200),
    payment_range_lower character varying(200),
    payment_range_higher character varying(200),
    experience_level integer,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp without time zone,
    status public.project_status,
    payment_type public.payment_type,
    payment_scheme public.payment_scheme,
    title text,
    expires_at timestamp without time zone,
    country character varying(3),
    skills text[],
    causes_tags public.social_causes_type[],
    old_id integer,
    other_party_id character varying(60),
    other_party_title character varying(250),
    other_party_url text,
    remote_preference public.project_remote_preference_type,
    search_tsv tsvector,
    city character varying(250),
    weekly_hours_lower character varying(200),
    weekly_hours_higher character varying(200),
    commitment_hours_lower character varying(200),
    commitment_hours_higher character varying(200),
    geoname_id integer,
    job_category_id uuid
);


ALTER TABLE public.temporary_table OWNER TO socious;

--
-- Name: time_zones; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.time_zones (
    timezone character varying(255) NOT NULL,
    timezone_utc character varying(50)
);


ALTER TABLE public.time_zones OWNER TO socious;

--
-- Name: tokens_blacklist; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.tokens_blacklist (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    token text,
    type public.token_type DEFAULT 'JWT_REFRESH'::public.token_type,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.tokens_blacklist OWNER TO socious;

--
-- Name: users; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    first_name character varying(70) DEFAULT NULL::character varying,
    username character varying(200) NOT NULL,
    email character varying(200) NOT NULL,
    email_text character varying(255) DEFAULT NULL::character varying,
    phone character varying(255) DEFAULT NULL::character varying,
    wallet_address character varying(255) DEFAULT NULL::character varying,
    password text,
    remember_token text,
    city text,
    description_search text,
    address text,
    expiry_date timestamp without time zone,
    status public.user_status DEFAULT 'INACTIVE'::public.user_status NOT NULL,
    mission text,
    bio text,
    view_as integer,
    language character varying(255) DEFAULT NULL::character varying,
    my_conversation character varying(255) DEFAULT NULL::character varying,
    email_verified_at timestamp without time zone,
    phone_verified_at timestamp without time zone,
    impact_points double precision DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    last_name character varying(70) DEFAULT NULL::character varying,
    password_expired boolean DEFAULT false,
    social_causes public.social_causes_type[],
    followers integer DEFAULT 0,
    followings integer DEFAULT 0,
    avatar uuid,
    cover_image uuid,
    skills text[],
    country character varying(3),
    mobile_country_code character varying(16),
    old_id integer,
    search_tsv tsvector,
    certificates text[],
    educations text[],
    goals text,
    geoname_id integer,
    is_admin boolean DEFAULT false,
    proofspace_connect_id character varying(250),
    open_to_work boolean DEFAULT false,
    open_to_volunteer boolean DEFAULT false,
    identity_verified boolean DEFAULT false
);


ALTER TABLE public.users OWNER TO socious;

--
-- Name: verification_credentials; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.verification_credentials (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    status public.experience_credentials_status DEFAULT 'PENDING'::public.experience_credentials_status NOT NULL,
    identity_id uuid NOT NULL,
    connection_id text,
    connection_url text,
    present_id text,
    body jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.verification_credentials OWNER TO socious;

--
-- Name: verification_documents; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.verification_documents (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    media_id uuid NOT NULL,
    verification_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.verification_documents OWNER TO socious;

--
-- Name: webhooks; Type: TABLE; Schema: public; Owner: socious
--

CREATE TABLE public.webhooks (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    party public.webhook_party_type NOT NULL,
    content jsonb,
    response jsonb,
    response_status_code integer,
    response_at timestamp without time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.webhooks OWNER TO socious;

--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: additionals additionals_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.additionals
    ADD CONSTRAINT additionals_pkey PRIMARY KEY (id);


--
-- Name: answers answers_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.answers
    ADD CONSTRAINT answers_pkey PRIMARY KEY (id);


--
-- Name: applicants applicants_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.applicants
    ADD CONSTRAINT applicants_pkey PRIMARY KEY (id);


--
-- Name: cards cards_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.cards
    ADD CONSTRAINT cards_pkey PRIMARY KEY (id);


--
-- Name: chats_participants chats_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.chats_participants
    ADD CONSTRAINT chats_participants_pkey PRIMARY KEY (id);


--
-- Name: chats chats_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.chats
    ADD CONSTRAINT chats_pkey PRIMARY KEY (id);


--
-- Name: collector_jobs collector_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.collector_jobs
    ADD CONSTRAINT collector_jobs_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: connections connections_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.connections
    ADD CONSTRAINT connections_pkey PRIMARY KEY (id);


--
-- Name: connections connections_relation_id_key; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.connections
    ADD CONSTRAINT connections_relation_id_key UNIQUE (relation_id);


--
-- Name: deleted_users deleted_users_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.deleted_users
    ADD CONSTRAINT deleted_users_pkey PRIMARY KEY (id);


--
-- Name: devices devices_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_pkey PRIMARY KEY (id);


--
-- Name: dispute_events dispute_events_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.dispute_events
    ADD CONSTRAINT dispute_events_pkey PRIMARY KEY (id);


--
-- Name: dispute_evidences dispute_evidences_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.dispute_evidences
    ADD CONSTRAINT dispute_evidences_pkey PRIMARY KEY (id);


--
-- Name: disputes disputes_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.disputes
    ADD CONSTRAINT disputes_pkey PRIMARY KEY (id);


--
-- Name: educations_credentials educations_credentials_education_id_key; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.educations_credentials
    ADD CONSTRAINT educations_credentials_education_id_key UNIQUE (education_id);


--
-- Name: educations_credentials educations_credentials_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.educations_credentials
    ADD CONSTRAINT educations_credentials_pkey PRIMARY KEY (id);


--
-- Name: educations educations_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.educations
    ADD CONSTRAINT educations_pkey PRIMARY KEY (id);


--
-- Name: emails emails_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.emails
    ADD CONSTRAINT emails_pkey PRIMARY KEY (id);


--
-- Name: emojis emojis_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.emojis
    ADD CONSTRAINT emojis_pkey PRIMARY KEY (id);


--
-- Name: missions employees_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.missions
    ADD CONSTRAINT employees_pkey PRIMARY KEY (id);


--
-- Name: escrows escrows_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.escrows
    ADD CONSTRAINT escrows_pkey PRIMARY KEY (id);


--
-- Name: experience_credentials experience_credentials_experience_id_key; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.experience_credentials
    ADD CONSTRAINT experience_credentials_experience_id_key UNIQUE (experience_id);


--
-- Name: experience_credentials experience_credentials_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.experience_credentials
    ADD CONSTRAINT experience_credentials_pkey PRIMARY KEY (id);


--
-- Name: experiences experiences_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.experiences
    ADD CONSTRAINT experiences_pkey PRIMARY KEY (id);


--
-- Name: feedbacks feedbacks_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.feedbacks
    ADD CONSTRAINT feedbacks_pkey PRIMARY KEY (id);


--
-- Name: follows follows_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_pkey PRIMARY KEY (id);


--
-- Name: geonames_alt geonames_alt_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.geonames_alt
    ADD CONSTRAINT geonames_alt_pkey PRIMARY KEY (id);


--
-- Name: geonames geonames_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.geonames
    ADD CONSTRAINT geonames_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: impact_points_history impact_points_history_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.impact_points_history
    ADD CONSTRAINT impact_points_history_pkey PRIMARY KEY (id);


--
-- Name: industries industries_name_key; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.industries
    ADD CONSTRAINT industries_name_key UNIQUE (name);


--
-- Name: industries industries_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.industries
    ADD CONSTRAINT industries_pkey PRIMARY KEY (id);


--
-- Name: job_categories job_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.job_categories
    ADD CONSTRAINT job_categories_pkey PRIMARY KEY (id);


--
-- Name: languages languages_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.languages
    ADD CONSTRAINT languages_pkey PRIMARY KEY (id);


--
-- Name: likes likes_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_pkey PRIMARY KEY (id);


--
-- Name: media media_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: migrations_state migrations_state_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.migrations_state
    ADD CONSTRAINT migrations_state_pkey PRIMARY KEY (key);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: notifications_settings notifications_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.notifications_settings
    ADD CONSTRAINT notifications_settings_pkey PRIMARY KEY (id);


--
-- Name: oauth_connects oauth_connects_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.oauth_connects
    ADD CONSTRAINT oauth_connects_pkey PRIMARY KEY (id);


--
-- Name: offers offers_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.offers
    ADD CONSTRAINT offers_pkey PRIMARY KEY (id);


--
-- Name: org_members org_members_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.org_members
    ADD CONSTRAINT org_members_pkey PRIMARY KEY (id);


--
-- Name: organizations organizations_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_pkey PRIMARY KEY (id);


--
-- Name: otps otps_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.otps
    ADD CONSTRAINT otps_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: payments payments_transaction_id_key; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key UNIQUE (transaction_id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: project_marks project_marks_identity_id_project_id_key; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.project_marks
    ADD CONSTRAINT project_marks_identity_id_project_id_key UNIQUE (identity_id, project_id);


--
-- Name: project_marks project_marks_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.project_marks
    ADD CONSTRAINT project_marks_pkey PRIMARY KEY (id);


--
-- Name: projects projects_other_party_id_other_party_title_key; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_other_party_id_other_party_title_key UNIQUE (other_party_id, other_party_title);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: questions questions_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);


--
-- Name: recommends recommends_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.recommends
    ADD CONSTRAINT recommends_pkey PRIMARY KEY (id);


--
-- Name: referrings referrings_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.referrings
    ADD CONSTRAINT referrings_pkey PRIMARY KEY (referred_identity_id);


--
-- Name: reports reports_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_pkey PRIMARY KEY (id);


--
-- Name: search_history search_history_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.search_history
    ADD CONSTRAINT search_history_pkey PRIMARY KEY (id);


--
-- Name: skills skills_name_key; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_name_key UNIQUE (name);


--
-- Name: skills skills_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_pkey PRIMARY KEY (id);


--
-- Name: submitted_works submitted_works_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.submitted_works
    ADD CONSTRAINT submitted_works_pkey PRIMARY KEY (id);


--
-- Name: time_zones time_zones_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.time_zones
    ADD CONSTRAINT time_zones_pkey PRIMARY KEY (timezone);


--
-- Name: tokens_blacklist tokens_blacklist_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.tokens_blacklist
    ADD CONSTRAINT tokens_blacklist_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_proofspace_connect_id_key; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_proofspace_connect_id_key UNIQUE (proofspace_connect_id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: verification_credentials verification_credentials_connection_id_key; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.verification_credentials
    ADD CONSTRAINT verification_credentials_connection_id_key UNIQUE (connection_id);


--
-- Name: verification_credentials verification_credentials_identity_id_key; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.verification_credentials
    ADD CONSTRAINT verification_credentials_identity_id_key UNIQUE (identity_id);


--
-- Name: verification_credentials verification_credentials_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.verification_credentials
    ADD CONSTRAINT verification_credentials_pkey PRIMARY KEY (id);


--
-- Name: verification_credentials verification_credentials_present_id_key; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.verification_credentials
    ADD CONSTRAINT verification_credentials_present_id_key UNIQUE (present_id);


--
-- Name: verification_documents verification_documents_media_id_key; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.verification_documents
    ADD CONSTRAINT verification_documents_media_id_key UNIQUE (media_id);


--
-- Name: verification_documents verification_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.verification_documents
    ADD CONSTRAINT verification_documents_pkey PRIMARY KEY (id);


--
-- Name: webhooks webhooks_pkey; Type: CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.webhooks
    ADD CONSTRAINT webhooks_pkey PRIMARY KEY (id);


--
-- Name: applicant_search_tsv_idx; Type: INDEX; Schema: public; Owner: socious
--

CREATE INDEX applicant_search_tsv_idx ON public.applicants USING gist (search_tsv);


--
-- Name: idx_applied; Type: INDEX; Schema: public; Owner: socious
--

CREATE UNIQUE INDEX idx_applied ON public.applicants USING btree (user_id, project_id);


--
-- Name: idx_device_tokens; Type: INDEX; Schema: public; Owner: socious
--

CREATE UNIQUE INDEX idx_device_tokens ON public.devices USING btree (token);


--
-- Name: idx_dispute_events; Type: INDEX; Schema: public; Owner: socious
--

CREATE INDEX idx_dispute_events ON public.dispute_events USING btree (dispute_id, created_at);


--
-- Name: idx_dispute_evidences; Type: INDEX; Schema: public; Owner: socious
--

CREATE INDEX idx_dispute_evidences ON public.dispute_evidences USING btree (dispute_event_id);


--
-- Name: idx_disputes; Type: INDEX; Schema: public; Owner: socious
--

CREATE INDEX idx_disputes ON public.disputes USING btree (claimant_id, respondent_id);


--
-- Name: idx_emoji; Type: INDEX; Schema: public; Owner: socious
--

CREATE UNIQUE INDEX idx_emoji ON public.emojis USING btree (identity_id, post_id, comment_id, emoji);


--
-- Name: idx_followed; Type: INDEX; Schema: public; Owner: socious
--

CREATE UNIQUE INDEX idx_followed ON public.follows USING btree (follower_identity_id, following_identity_id);


--
-- Name: idx_identity_chat; Type: INDEX; Schema: public; Owner: socious
--

CREATE UNIQUE INDEX idx_identity_chat ON public.chats_participants USING btree (identity_id, chat_id);


--
-- Name: idx_identity_entity; Type: INDEX; Schema: public; Owner: socious
--

CREATE UNIQUE INDEX idx_identity_entity ON public.recommends USING btree (identity_id, entity_id);


--
-- Name: idx_identity_project; Type: INDEX; Schema: public; Owner: socious
--

CREATE INDEX idx_identity_project ON public.missions USING btree (assignee_id, project_id);


--
-- Name: idx_liked_comments; Type: INDEX; Schema: public; Owner: socious
--

CREATE UNIQUE INDEX idx_liked_comments ON public.likes USING btree (post_id, identity_id, comment_id) WHERE (comment_id IS NOT NULL);


--
-- Name: idx_liked_posts; Type: INDEX; Schema: public; Owner: socious
--

CREATE UNIQUE INDEX idx_liked_posts ON public.likes USING btree (post_id, identity_id) WHERE (comment_id IS NULL);


--
-- Name: idx_matrix_unique; Type: INDEX; Schema: public; Owner: socious
--

CREATE INDEX idx_matrix_unique ON public.organizations USING btree (other_party_id, other_party_title);


--
-- Name: idx_mission_feedback; Type: INDEX; Schema: public; Owner: socious
--

CREATE UNIQUE INDEX idx_mission_feedback ON public.feedbacks USING btree (identity_id, mission_id);


--
-- Name: idx_notif_settings; Type: INDEX; Schema: public; Owner: socious
--

CREATE UNIQUE INDEX idx_notif_settings ON public.notifications_settings USING btree (user_id, type);


--
-- Name: idx_oauth_mui; Type: INDEX; Schema: public; Owner: socious
--

CREATE UNIQUE INDEX idx_oauth_mui ON public.oauth_connects USING btree (identity_id, provider);


--
-- Name: idx_orgs_shortname; Type: INDEX; Schema: public; Owner: socious
--

CREATE UNIQUE INDEX idx_orgs_shortname ON public.organizations USING btree (shortname);


--
-- Name: idx_other_party_mui; Type: INDEX; Schema: public; Owner: socious
--

CREATE UNIQUE INDEX idx_other_party_mui ON public.organizations USING btree (other_party_id, other_party_title);


--
-- Name: idx_otp_code_user; Type: INDEX; Schema: public; Owner: socious
--

CREATE UNIQUE INDEX idx_otp_code_user ON public.otps USING btree (user_id, code);


--
-- Name: idx_phone_country_code; Type: INDEX; Schema: public; Owner: socious
--

CREATE UNIQUE INDEX idx_phone_country_code ON public.users USING btree (phone, mobile_country_code);


--
-- Name: idx_report_comment; Type: INDEX; Schema: public; Owner: socious
--

CREATE UNIQUE INDEX idx_report_comment ON public.reports USING btree (identity_id, comment_id);


--
-- Name: idx_report_org; Type: INDEX; Schema: public; Owner: socious
--

CREATE UNIQUE INDEX idx_report_org ON public.reports USING btree (identity_id, org_id);


--
-- Name: idx_report_post; Type: INDEX; Schema: public; Owner: socious
--

CREATE UNIQUE INDEX idx_report_post ON public.reports USING btree (identity_id, post_id);


--
-- Name: idx_report_user; Type: INDEX; Schema: public; Owner: socious
--

CREATE UNIQUE INDEX idx_report_user ON public.reports USING btree (identity_id, user_id);


--
-- Name: org_search_tsv_idx; Type: INDEX; Schema: public; Owner: socious
--

CREATE INDEX org_search_tsv_idx ON public.organizations USING gin (search_tsv);


--
-- Name: post_search_tsv_idx; Type: INDEX; Schema: public; Owner: socious
--

CREATE INDEX post_search_tsv_idx ON public.posts USING gin (search_tsv);


--
-- Name: project_search_tsv_idx; Type: INDEX; Schema: public; Owner: socious
--

CREATE INDEX project_search_tsv_idx ON public.projects USING gin (search_tsv);


--
-- Name: user_search_tsv_idx; Type: INDEX; Schema: public; Owner: socious
--

CREATE INDEX user_search_tsv_idx ON public.users USING gin (search_tsv);


--
-- Name: search_history upsert_search_history; Type: RULE; Schema: public; Owner: socious
--

CREATE RULE upsert_search_history AS
    ON INSERT TO public.search_history
   WHERE (EXISTS ( SELECT search_history_1.id
           FROM public.search_history search_history_1
          WHERE (((search_history_1.updated_at + '00:00:30'::interval) > now()) AND (search_history_1.identity_id = new.identity_id))
         LIMIT 1)) DO INSTEAD  UPDATE public.search_history SET updated_at = now(), body = new.body
  WHERE (search_history.id = ( SELECT search_history_1.id
           FROM public.search_history search_history_1
          WHERE (((search_history_1.updated_at + '00:00:30'::interval) > now()) AND (search_history_1.identity_id = new.identity_id))
         LIMIT 1));


--
-- Name: applicants applicant_tsv_insert; Type: TRIGGER; Schema: public; Owner: socious
--

CREATE TRIGGER applicant_tsv_insert BEFORE INSERT ON public.applicants FOR EACH ROW EXECUTE FUNCTION public.applicant_tsv();


--
-- Name: applicants applicant_tsv_update; Type: TRIGGER; Schema: public; Owner: socious
--

CREATE TRIGGER applicant_tsv_update BEFORE UPDATE ON public.applicants FOR EACH ROW EXECUTE FUNCTION public.applicant_tsv();


--
-- Name: tokens_blacklist cleaner; Type: TRIGGER; Schema: public; Owner: socious
--

CREATE TRIGGER cleaner AFTER INSERT ON public.tokens_blacklist FOR EACH ROW EXECUTE FUNCTION public.cleaner();


--
-- Name: comments del_comment; Type: TRIGGER; Schema: public; Owner: socious
--

CREATE TRIGGER del_comment BEFORE DELETE ON public.comments FOR EACH ROW EXECUTE FUNCTION public.remove_comment();


--
-- Name: posts del_post; Type: TRIGGER; Schema: public; Owner: socious
--

CREATE TRIGGER del_post AFTER DELETE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.del_post();


--
-- Name: follows delete_follow; Type: TRIGGER; Schema: public; Owner: socious
--

CREATE TRIGGER delete_follow BEFORE DELETE ON public.follows FOR EACH ROW EXECUTE FUNCTION public.unfollowed();


--
-- Name: organizations delete_identity; Type: TRIGGER; Schema: public; Owner: socious
--

CREATE TRIGGER delete_identity AFTER DELETE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.delete_identity();


--
-- Name: users delete_identity; Type: TRIGGER; Schema: public; Owner: socious
--

CREATE TRIGGER delete_identity AFTER DELETE ON public.users FOR EACH ROW EXECUTE FUNCTION public.delete_identity();


--
-- Name: connections follow_on_connect; Type: TRIGGER; Schema: public; Owner: socious
--

CREATE TRIGGER follow_on_connect AFTER UPDATE ON public.connections FOR EACH ROW EXECUTE FUNCTION public.follow_on_connect();


--
-- Name: organizations insert_identity; Type: TRIGGER; Schema: public; Owner: socious
--

CREATE TRIGGER insert_identity AFTER INSERT ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.set_orgs_identity();


--
-- Name: users insert_identity; Type: TRIGGER; Schema: public; Owner: socious
--

CREATE TRIGGER insert_identity AFTER INSERT ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_users_identity();


--
-- Name: projects insert_project_on_impact; Type: TRIGGER; Schema: public; Owner: socious
--

CREATE TRIGGER insert_project_on_impact BEFORE INSERT ON public.projects FOR EACH ROW EXECUTE FUNCTION public.active_by_impact_job();


--
-- Name: likes liked; Type: TRIGGER; Schema: public; Owner: socious
--

CREATE TRIGGER liked AFTER INSERT ON public.likes FOR EACH ROW EXECUTE FUNCTION public.liked();


--
-- Name: organizations lowercase_trigger; Type: TRIGGER; Schema: public; Owner: socious
--

CREATE TRIGGER lowercase_trigger BEFORE INSERT OR UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.make_shotname_lowercase();


--
-- Name: missions missions_status; Type: TRIGGER; Schema: public; Owner: socious
--

CREATE TRIGGER missions_status AFTER UPDATE ON public.missions FOR EACH ROW EXECUTE FUNCTION public.missions_status();


--
-- Name: chats new_chat; Type: TRIGGER; Schema: public; Owner: socious
--

CREATE TRIGGER new_chat AFTER INSERT ON public.chats FOR EACH ROW EXECUTE FUNCTION public.new_chat();


--
-- Name: comments new_comment; Type: TRIGGER; Schema: public; Owner: socious
--

CREATE TRIGGER new_comment AFTER INSERT ON public.comments FOR EACH ROW EXECUTE FUNCTION public.new_comment();


--
-- Name: follows new_follow; Type: TRIGGER; Schema: public; Owner: socious
--

CREATE TRIGGER new_follow AFTER INSERT ON public.follows FOR EACH ROW EXECUTE FUNCTION public.followed();


--
-- Name: messages new_message; Type: TRIGGER; Schema: public; Owner: socious
--

CREATE TRIGGER new_message BEFORE INSERT ON public.messages FOR EACH ROW EXECUTE FUNCTION public.new_message();


--
-- Name: organizations new_orgs; Type: TRIGGER; Schema: public; Owner: socious
--

CREATE TRIGGER new_orgs AFTER INSERT ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.new_orgs();


--
-- Name: posts new_post; Type: TRIGGER; Schema: public; Owner: socious
--

CREATE TRIGGER new_post AFTER INSERT ON public.posts FOR EACH ROW EXECUTE FUNCTION public.new_post();


--
-- Name: project_marks not_interested; Type: TRIGGER; Schema: public; Owner: socious
--

CREATE TRIGGER not_interested AFTER INSERT ON public.project_marks FOR EACH ROW EXECUTE FUNCTION public.not_interest();


--
-- Name: organizations org_tsv_insert; Type: TRIGGER; Schema: public; Owner: socious
--

CREATE TRIGGER org_tsv_insert BEFORE INSERT ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.org_tsv();


--
-- Name: organizations org_tsv_update; Type: TRIGGER; Schema: public; Owner: socious
--

CREATE TRIGGER org_tsv_update BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.org_tsv();


--
-- Name: posts post_tsv_insert; Type: TRIGGER; Schema: public; Owner: socious
--

CREATE TRIGGER post_tsv_insert BEFORE INSERT ON public.posts FOR EACH ROW EXECUTE FUNCTION public.post_tsv();


--
-- Name: posts post_tsv_update; Type: TRIGGER; Schema: public; Owner: socious
--

CREATE TRIGGER post_tsv_update BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.post_tsv();


--
-- Name: projects project_tsv_insert; Type: TRIGGER; Schema: public; Owner: socious
--

CREATE TRIGGER project_tsv_insert BEFORE INSERT ON public.projects FOR EACH ROW EXECUTE FUNCTION public.project_tsv();


--
-- Name: projects project_tsv_update; Type: TRIGGER; Schema: public; Owner: socious
--

CREATE TRIGGER project_tsv_update BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.project_tsv();


--
-- Name: connections relation; Type: TRIGGER; Schema: public; Owner: socious
--

CREATE TRIGGER relation BEFORE INSERT ON public.connections FOR EACH ROW EXECUTE FUNCTION public.generate_relation();


--
-- Name: likes unliked; Type: TRIGGER; Schema: public; Owner: socious
--

CREATE TRIGGER unliked BEFORE DELETE ON public.likes FOR EACH ROW EXECUTE FUNCTION public.unliked();


--
-- Name: organizations update_identity; Type: TRIGGER; Schema: public; Owner: socious
--

CREATE TRIGGER update_identity AFTER UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.set_orgs_identity();


--
-- Name: users update_identity; Type: TRIGGER; Schema: public; Owner: socious
--

CREATE TRIGGER update_identity AFTER UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_users_identity();


--
-- Name: projects update_project_on_impact; Type: TRIGGER; Schema: public; Owner: socious
--

CREATE TRIGGER update_project_on_impact BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.active_by_impact_job();


--
-- Name: impact_points_history update_user_impact_points; Type: TRIGGER; Schema: public; Owner: socious
--

CREATE TRIGGER update_user_impact_points AFTER INSERT ON public.impact_points_history FOR EACH ROW EXECUTE FUNCTION public.update_user_impact_points();


--
-- Name: users user_tsv_insert; Type: TRIGGER; Schema: public; Owner: socious
--

CREATE TRIGGER user_tsv_insert BEFORE INSERT ON public.users FOR EACH ROW EXECUTE FUNCTION public.user_tsv();


--
-- Name: users user_tsv_update; Type: TRIGGER; Schema: public; Owner: socious
--

CREATE TRIGGER user_tsv_update BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.user_tsv();


--
-- Name: verification_credentials verfication_update; Type: TRIGGER; Schema: public; Owner: socious
--

CREATE TRIGGER verfication_update AFTER INSERT OR UPDATE ON public.verification_credentials FOR EACH ROW WHEN ((new.status = 'APPROVED'::public.experience_credentials_status)) EXECUTE FUNCTION public.approved_verification();


--
-- Name: answers fk_applicant; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.answers
    ADD CONSTRAINT fk_applicant FOREIGN KEY (applicant_id) REFERENCES public.applicants(id) ON DELETE CASCADE;


--
-- Name: offers fk_applicant; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.offers
    ADD CONSTRAINT fk_applicant FOREIGN KEY (applicant_id) REFERENCES public.applicants(id) ON DELETE SET NULL;


--
-- Name: missions fk_applicant; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.missions
    ADD CONSTRAINT fk_applicant FOREIGN KEY (applicant_id) REFERENCES public.applicants(id) ON DELETE SET NULL;


--
-- Name: chats_participants fk_chat; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.chats_participants
    ADD CONSTRAINT fk_chat FOREIGN KEY (chat_id) REFERENCES public.chats(id) ON DELETE CASCADE;


--
-- Name: messages fk_chat; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT fk_chat FOREIGN KEY (chat_id) REFERENCES public.chats(id) ON DELETE CASCADE;


--
-- Name: disputes fk_claimant; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.disputes
    ADD CONSTRAINT fk_claimant FOREIGN KEY (claimant_id) REFERENCES public.identities(id) ON DELETE CASCADE;


--
-- Name: comments fk_comment; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fk_comment FOREIGN KEY (reply_id) REFERENCES public.comments(id) ON DELETE CASCADE;


--
-- Name: likes fk_comment; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT fk_comment FOREIGN KEY (comment_id) REFERENCES public.comments(id) ON DELETE CASCADE;


--
-- Name: reports fk_comment; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT fk_comment FOREIGN KEY (comment_id) REFERENCES public.comments(id) ON DELETE SET NULL;


--
-- Name: emojis fk_comment; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.emojis
    ADD CONSTRAINT fk_comment FOREIGN KEY (comment_id) REFERENCES public.comments(id) ON DELETE CASCADE;


--
-- Name: dispute_events fk_dispute; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.dispute_events
    ADD CONSTRAINT fk_dispute FOREIGN KEY (dispute_id) REFERENCES public.disputes(id) ON DELETE CASCADE;


--
-- Name: dispute_evidences fk_dispute; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.dispute_evidences
    ADD CONSTRAINT fk_dispute FOREIGN KEY (dispute_id) REFERENCES public.disputes(id) ON DELETE CASCADE;


--
-- Name: dispute_evidences fk_dispute_event; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.dispute_evidences
    ADD CONSTRAINT fk_dispute_event FOREIGN KEY (dispute_event_id) REFERENCES public.dispute_events(id) ON DELETE CASCADE;


--
-- Name: educations_credentials fk_education; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.educations_credentials
    ADD CONSTRAINT fk_education FOREIGN KEY (education_id) REFERENCES public.educations(id) ON DELETE CASCADE;


--
-- Name: experience_credentials fk_experience; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.experience_credentials
    ADD CONSTRAINT fk_experience FOREIGN KEY (experience_id) REFERENCES public.experiences(id) ON DELETE CASCADE;


--
-- Name: follows fk_follower_identity; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT fk_follower_identity FOREIGN KEY (follower_identity_id) REFERENCES public.identities(id) ON DELETE CASCADE;


--
-- Name: follows fk_following_identity; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT fk_following_identity FOREIGN KEY (following_identity_id) REFERENCES public.identities(id) ON DELETE CASCADE;


--
-- Name: geonames_alt fk_geoname; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.geonames_alt
    ADD CONSTRAINT fk_geoname FOREIGN KEY (geoname_id) REFERENCES public.geonames(id) ON DELETE CASCADE;


--
-- Name: users fk_geoname; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_geoname FOREIGN KEY (geoname_id) REFERENCES public.geonames(id) ON DELETE CASCADE;


--
-- Name: organizations fk_geoname; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT fk_geoname FOREIGN KEY (geoname_id) REFERENCES public.geonames(id) ON DELETE CASCADE;


--
-- Name: projects fk_geoname; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT fk_geoname FOREIGN KEY (geoname_id) REFERENCES public.geonames(id) ON DELETE CASCADE;


--
-- Name: posts fk_identity; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES public.identities(id) ON DELETE CASCADE;


--
-- Name: projects fk_identity; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES public.identities(id) ON DELETE CASCADE;


--
-- Name: chats_participants fk_identity; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.chats_participants
    ADD CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES public.identities(id) ON DELETE CASCADE;


--
-- Name: messages fk_identity; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES public.identities(id) ON DELETE CASCADE;


--
-- Name: media fk_identity; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES public.identities(id) ON DELETE CASCADE;


--
-- Name: comments fk_identity; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES public.identities(id) ON DELETE CASCADE;


--
-- Name: likes fk_identity; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES public.identities(id) ON DELETE CASCADE;


--
-- Name: search_history fk_identity; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.search_history
    ADD CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES public.identities(id) ON DELETE CASCADE;


--
-- Name: payments fk_identity; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES public.identities(id) ON DELETE CASCADE;


--
-- Name: missions fk_identity; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.missions
    ADD CONSTRAINT fk_identity FOREIGN KEY (assignee_id) REFERENCES public.identities(id) ON DELETE CASCADE;


--
-- Name: feedbacks fk_identity; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.feedbacks
    ADD CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES public.identities(id) ON DELETE CASCADE;


--
-- Name: cards fk_identity; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.cards
    ADD CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES public.identities(id) ON DELETE CASCADE;


--
-- Name: oauth_connects fk_identity; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.oauth_connects
    ADD CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES public.identities(id) ON DELETE CASCADE;


--
-- Name: impact_points_history fk_identity; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.impact_points_history
    ADD CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES public.identities(id) ON DELETE CASCADE;


--
-- Name: additionals fk_identity; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.additionals
    ADD CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES public.identities(id) ON DELETE CASCADE;


--
-- Name: verification_credentials fk_identity; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.verification_credentials
    ADD CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES public.identities(id) ON DELETE CASCADE;


--
-- Name: project_marks fk_identity; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.project_marks
    ADD CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES public.identities(id) ON DELETE CASCADE;


--
-- Name: recommends fk_identity; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.recommends
    ADD CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES public.identities(id) ON DELETE CASCADE;


--
-- Name: emojis fk_identity; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.emojis
    ADD CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES public.identities(id) ON DELETE CASCADE;


--
-- Name: dispute_events fk_identity; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.dispute_events
    ADD CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES public.identities(id) ON DELETE CASCADE;


--
-- Name: dispute_evidences fk_identity; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.dispute_evidences
    ADD CONSTRAINT fk_identity FOREIGN KEY (identity_id) REFERENCES public.identities(id) ON DELETE CASCADE;


--
-- Name: missions fk_identity_assigner; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.missions
    ADD CONSTRAINT fk_identity_assigner FOREIGN KEY (assigner_id) REFERENCES public.identities(id) ON DELETE CASCADE;


--
-- Name: offers fk_identity_offerer; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.offers
    ADD CONSTRAINT fk_identity_offerer FOREIGN KEY (offerer_id) REFERENCES public.identities(id) ON DELETE CASCADE;


--
-- Name: offers fk_identity_recipient; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.offers
    ADD CONSTRAINT fk_identity_recipient FOREIGN KEY (recipient_id) REFERENCES public.identities(id) ON DELETE CASCADE;


--
-- Name: connections fk_identity_requested; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.connections
    ADD CONSTRAINT fk_identity_requested FOREIGN KEY (requested_id) REFERENCES public.identities(id) ON DELETE CASCADE;


--
-- Name: connections fk_identity_requester; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.connections
    ADD CONSTRAINT fk_identity_requester FOREIGN KEY (requester_id) REFERENCES public.identities(id) ON DELETE CASCADE;


--
-- Name: projects fk_job_category; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT fk_job_category FOREIGN KEY (job_category_id) REFERENCES public.job_categories(id);


--
-- Name: experiences fk_job_category; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.experiences
    ADD CONSTRAINT fk_job_category FOREIGN KEY (job_category_id) REFERENCES public.job_categories(id);


--
-- Name: chats_participants fk_joined_by_identity; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.chats_participants
    ADD CONSTRAINT fk_joined_by_identity FOREIGN KEY (joined_by) REFERENCES public.identities(id) ON DELETE SET NULL;


--
-- Name: messages fk_media; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT fk_media FOREIGN KEY (media) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: applicants fk_media; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.applicants
    ADD CONSTRAINT fk_media FOREIGN KEY (attachment) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: comments fk_media; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fk_media FOREIGN KEY (media_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: dispute_evidences fk_media; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.dispute_evidences
    ADD CONSTRAINT fk_media FOREIGN KEY (media_id) REFERENCES public.media(id) ON DELETE CASCADE;


--
-- Name: users fk_media_avatar; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_media_avatar FOREIGN KEY (avatar) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: users fk_media_cover_image; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_media_cover_image FOREIGN KEY (cover_image) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: organizations fk_media_cover_image; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT fk_media_cover_image FOREIGN KEY (cover_image) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: organizations fk_media_image; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT fk_media_image FOREIGN KEY (image) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: additionals fk_media_image; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.additionals
    ADD CONSTRAINT fk_media_image FOREIGN KEY (image) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: additionals fk_media_sub_image; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.additionals
    ADD CONSTRAINT fk_media_sub_image FOREIGN KEY (sub_image) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: feedbacks fk_mission; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.feedbacks
    ADD CONSTRAINT fk_mission FOREIGN KEY (mission_id) REFERENCES public.missions(id) ON DELETE CASCADE;


--
-- Name: escrows fk_mission; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.escrows
    ADD CONSTRAINT fk_mission FOREIGN KEY (mission_id) REFERENCES public.missions(id) ON DELETE SET NULL;


--
-- Name: impact_points_history fk_mission; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.impact_points_history
    ADD CONSTRAINT fk_mission FOREIGN KEY (mission_id) REFERENCES public.missions(id) ON DELETE SET NULL;


--
-- Name: submitted_works fk_mission; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.submitted_works
    ADD CONSTRAINT fk_mission FOREIGN KEY (mission_id) REFERENCES public.missions(id) ON DELETE SET NULL;


--
-- Name: missions fk_offer; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.missions
    ADD CONSTRAINT fk_offer FOREIGN KEY (offer_id) REFERENCES public.offers(id) ON DELETE CASCADE;


--
-- Name: escrows fk_offer; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.escrows
    ADD CONSTRAINT fk_offer FOREIGN KEY (offer_id) REFERENCES public.offers(id) ON DELETE SET NULL;


--
-- Name: org_members fk_org; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.org_members
    ADD CONSTRAINT fk_org FOREIGN KEY (org_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: experiences fk_org; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.experiences
    ADD CONSTRAINT fk_org FOREIGN KEY (org_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: reports fk_org; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT fk_org FOREIGN KEY (org_id) REFERENCES public.organizations(id) ON DELETE SET NULL;


--
-- Name: experience_credentials fk_org; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.experience_credentials
    ADD CONSTRAINT fk_org FOREIGN KEY (org_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: educations fk_org; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.educations
    ADD CONSTRAINT fk_org FOREIGN KEY (org_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: educations_credentials fk_org; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.educations_credentials
    ADD CONSTRAINT fk_org FOREIGN KEY (org_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: escrows fk_payment; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.escrows
    ADD CONSTRAINT fk_payment FOREIGN KEY (payment_id) REFERENCES public.payments(id);


--
-- Name: comments fk_post; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fk_post FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: likes fk_post; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT fk_post FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: posts fk_post; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT fk_post FOREIGN KEY (shared_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: reports fk_post; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT fk_post FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE SET NULL;


--
-- Name: emojis fk_post; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.emojis
    ADD CONSTRAINT fk_post FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: applicants fk_project; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.applicants
    ADD CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: questions fk_project; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: answers fk_project; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.answers
    ADD CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: escrows fk_project; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.escrows
    ADD CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: missions fk_project; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.missions
    ADD CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: feedbacks fk_project; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.feedbacks
    ADD CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: offers fk_project; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.offers
    ADD CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: submitted_works fk_project; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.submitted_works
    ADD CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE SET NULL;


--
-- Name: project_marks fk_project; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.project_marks
    ADD CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: answers fk_question; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.answers
    ADD CONSTRAINT fk_question FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;


--
-- Name: additionals fk_ref_identity; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.additionals
    ADD CONSTRAINT fk_ref_identity FOREIGN KEY (ref_identity_id) REFERENCES public.identities(id) ON DELETE CASCADE;


--
-- Name: disputes fk_respondent; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.disputes
    ADD CONSTRAINT fk_respondent FOREIGN KEY (respondent_id) REFERENCES public.identities(id) ON DELETE CASCADE;


--
-- Name: impact_points_history fk_submitted_works; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.impact_points_history
    ADD CONSTRAINT fk_submitted_works FOREIGN KEY (submitted_work_id) REFERENCES public.submitted_works(id) ON DELETE SET NULL;


--
-- Name: otps fk_user; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.otps
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: org_members fk_user; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.org_members
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: notifications fk_user; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: applicants fk_user; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.applicants
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: devices fk_user; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: experiences fk_user; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.experiences
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: languages fk_user; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.languages
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: reports fk_user; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: experience_credentials fk_user; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.experience_credentials
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: educations fk_user; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.educations
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: educations_credentials fk_user; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.educations_credentials
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: verification_documents fk_verification_credentials; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.verification_documents
    ADD CONSTRAINT fk_verification_credentials FOREIGN KEY (verification_id) REFERENCES public.verification_credentials(id) ON DELETE CASCADE;


--
-- Name: referrings referrings_referred_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.referrings
    ADD CONSTRAINT referrings_referred_by_id_fkey FOREIGN KEY (referred_by_id) REFERENCES public.identities(id);


--
-- Name: referrings referrings_referred_identity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: socious
--

ALTER TABLE ONLY public.referrings
    ADD CONSTRAINT referrings_referred_identity_id_fkey FOREIGN KEY (referred_identity_id) REFERENCES public.identities(id);


--
-- PostgreSQL database dump complete
--

