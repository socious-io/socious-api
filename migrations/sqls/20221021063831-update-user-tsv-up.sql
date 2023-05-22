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
