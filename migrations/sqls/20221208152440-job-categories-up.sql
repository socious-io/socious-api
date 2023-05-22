INSERT INTO job_categories (name, hourly_wage_dollars) VALUES
('Frontend development', 25),
('Backend development', 25),
('Full-stack development', 28),
('Blockchain development', 44.5),
('Data science', 37.5),
('UX/UI Design', 32),
('Web Design', 22.5),
('Graphic Design', 25),
('Video Editing', 22.5),
('Illustration', 22.5),
('Video Production', 22.5),
('Animation', 29),
('Photo Editing', 18.5),
('Brand Identity & Guidelines', 25),
('Sound Editing', 25),
('Print Design', 25),
('Social Media Marketing', 25),
('Marketing Strategy', 25),
('SEO', 25),
('Influencer Marketing', 25),
('Content Writing', 27.5),
('Project Management', 32),
('Product Management', 35),
('Recruiting', 25),
('HR Management', 25),
('Other', 20);



UPDATE skills SET job_category_id=cat.id FROM job_categories cat WHERE cat.name='Other';


ALTER TABLE offers 
  DROP COLUMN payment_type,
  DROP COLUMN payment_scheme;
