/* Replace with your SQL commands */
DELETE FROM feedbacks;
CREATE UNIQUE INDEX IF NOT EXISTS idx_mission_feedback ON feedbacks(identity_id, mission_id);
