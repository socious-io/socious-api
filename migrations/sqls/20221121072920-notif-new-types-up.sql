ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'OFFER';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'REJECT';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'APPROVED';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'HIRED';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'PROJECT_COMPLETE';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'ASSIGNEE_CANCELED';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'ASSIGNER_CANCELED';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'ASSIGNER_CONFIRMED';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'CONNECT';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'MEMBERED';