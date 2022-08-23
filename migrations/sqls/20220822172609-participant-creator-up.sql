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
