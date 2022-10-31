
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
