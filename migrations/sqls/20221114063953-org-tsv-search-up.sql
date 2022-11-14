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
