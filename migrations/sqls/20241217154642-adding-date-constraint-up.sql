ALTER TABLE experiences
ADD CONSTRAINT start_at_before_end_at
CHECK (start_at <= end_at OR start_at IS NULL OR end_at IS NULL);

ALTER TABLE educations
ADD CONSTRAINT start_at_before_end_at
CHECK (start_at <= end_at OR start_at IS NULL OR end_at IS NULL);
