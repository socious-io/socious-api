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
