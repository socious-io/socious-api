/* Replace with your SQL commands */
-- CREATE TABLE dispute_categories (
--   id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
--   name text NOT NULL,
--   created_at timestamp with time zone NOT NULL DEFAULT now(),
--   updated_at timestamp with time zone NOT NULL DEFAULT now()
-- );

-- INSERT INTO
--   dispute_categories (name)
-- VALUES
--   ('Scope and Contract Disputes Issues'),
--   ('Incomplete or Unsatisfactory Work'),
--   ('Communication Problems'),
--   ('Scope and Contract Disputes'),
--   ('Intellectual Property and Confidentiality'),
--   ('Professionalism and Conduct'),
--   ('Cancellation and Refunds'),
--   ('Others');

CREATE TYPE dispute_categories AS ENUM (
  'Scope and Contract Disputes Issues',
  'Incomplete or Unsatisfactory Work',
  'Communication Problems',
  'Scope and Contract Disputes',
  'Intellectual Property and Confidentiality',
  'Professionalism and Conduct',
  'Cancellation and Refunds',
  'Others'
);

ALTER TABLE
  disputes
ADD
  COLUMN category dispute_categories NOT NULL DEFAULT 'Others';
