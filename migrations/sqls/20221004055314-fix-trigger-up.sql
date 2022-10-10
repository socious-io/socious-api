DROP TRIGGER project_escrow_update ON projects;

CREATE TRIGGER project_escrow_update
    AFTER UPDATE ON escrows FOR EACH ROW EXECUTE FUNCTION project_escrow();


CREATE TRIGGER applicant_employee
    AFTER UPDATE ON applicants FOR EACH ROW EXECUTE FUNCTION applicant_employee();
