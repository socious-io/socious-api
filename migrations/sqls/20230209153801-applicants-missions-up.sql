ALTER TABLE missions 
   DROP CONSTRAINT fk_applicant;

ALTER TABLE missions 
    ADD CONSTRAINT fk_applicant FOREIGN KEY (applicant_id) REFERENCES applicants(id) ON DELETE SET NULL;
