ALTER TABLE applicants ADD COLUMN search_tsv tsvector;
CREATE INDEX applicant_search_tsv_idx ON applicants USING GIST (search_tsv); 


CREATE  FUNCTION applicant_tsv()
RETURNS TRIGGER AS
$$
BEGIN   
  NEW.search_tsv := to_tsvector(
    'english', 
    (SELECT concat_ws(' ', username, first_name, last_name) FROM users WHERE id=NEW.user_id)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER applicant_tsv_insert
    BEFORE INSERT ON applicants FOR EACH ROW EXECUTE FUNCTION applicant_tsv();

CREATE TRIGGER applicant_tsv_update
    BEFORE UPDATE ON applicants FOR EACH ROW EXECUTE FUNCTION applicant_tsv();


UPDATE applicants SET id=id;
