ALTER TABLE projects 
  ADD COLUMN weekly_hours_lower varchar(200),
  ADD COLUMN weekly_hours_higher varchar(200),
  ADD COLUMN commitment_hours_lower varchar(200),
  ADD COLUMN commitment_hours_higher varchar(200);


ALTER TABLE applicants
  ADD COLUMN cv_link text,
  ADD COLUMN cv_name varchar(128),
  ADD COLUMN share_contact_info boolean;
