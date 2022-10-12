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
