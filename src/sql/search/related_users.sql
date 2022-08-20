WITH fl AS (
  SELECT * FROM follows WHERE follower_identity_id=$4 OR following_identity_id=$4
)
SELECT
  COUNT(*) OVER () as total_count,
  u.id, u.username, u.first_name, u.last_name, u.avatar
FROM users u
WHERE
  (
    u.id IN (SELECT following_identity_id FROM fl) OR 
    u.id IN (SELECT follower_identity_id FROM fl)
  ) AND
  u.id <> $4 AND
  to_tsvector(
    'english', 
    u.username || ' ' || u.first_name || ' ' || u.last_name
  )
  @@ websearch_to_tsquery($1)

ORDER BY u.created_at DESC  LIMIT $2 OFFSET $3
