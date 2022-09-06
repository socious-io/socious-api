CREATE TABLE questions (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  project_id uuid NOT NULL,
  question text NOT NULL,
  required boolean DEFAULT false,
  options text[],
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);


CREATE TABLE answers (
  id uuid DEFAULT public.uuid_generate_v4() PRIMARY KEY NOT NULL,
  project_id uuid NOT NULL,
  question_id uuid NOT NULL,
  applicant_id uuid NOT NULL,
  answer text,
  selected_option int,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  CONSTRAINT fk_applicant FOREIGN KEY (applicant_id) REFERENCES applicants(id) ON DELETE CASCADE
);
