CREATE TABLE socious_events (
  id uuid NOT NULL DEFAULT public.uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL UNIQUE,
  description text NOT NULL,
  event_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE users DROP COLUMN events;
ALTER TABLE users ADD COLUMN events uuid[];

INSERT INTO socious_events (title, description, event_at) VALUES (
  'Tech for Impact Summit 2024',
  'Boost your summit experience by connecting with fellow innovators and change-makers.',
  '2024-08-01T18:25:43.511Z'
);
