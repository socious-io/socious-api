UPDATE organizations
SET status=(CASE WHEN verified=TRUE OR verified_impact=TRUE THEN 'ACTIVE'::org_status ELSE 'INACTIVE'::org_status END)
WHERE status!='SUSPEND';
