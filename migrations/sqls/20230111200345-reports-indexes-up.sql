CREATE UNIQUE INDEX IF NOT EXISTS idx_report_post ON reports(identity_id, post_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_report_user ON reports(identity_id, user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_report_comment ON reports(identity_id, comment_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_report_org ON reports(identity_id, org_id);
