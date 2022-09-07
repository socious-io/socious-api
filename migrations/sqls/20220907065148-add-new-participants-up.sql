
CREATE OR REPLACE FUNCTION new_participant()
  RETURNS TRIGGER AS
$$
BEGIN
  UPDATE chats SET participants=array_append(participants, NEW.id) WHERE id=NEW.chat_id;
  RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;


CREATE OR REPLACE FUNCTION remove_participant()
  RETURNS TRIGGER AS
$$
BEGIN
  UPDATE chats SET participants=array_remove(participants, OLD.id) WHERE id=OLD.chat_id;
  RETURN OLD;
END;
$$
LANGUAGE PLPGSQL;


CREATE TRIGGER new_participant
    AFTER INSERT ON chats_participants FOR EACH ROW EXECUTE FUNCTION new_participant();

CREATE TRIGGER remove_participant
    AFTER DELETE ON chats_participants FOR EACH ROW EXECUTE FUNCTION remove_participant();
