WITH fl AS (
  SELECT * FROM follows WHERE follower_identity_id=$4 OR following_identity_id=$4
)
SELECT
  u.id
FROM users u
WHERE
  (
    u.id IN (SELECT following_identity_id FROM fl) OR 
    u.id IN (SELECT follower_identity_id FROM fl)
  ) AND
  u.id <> $4 AND
  to_tsvector(
    'english', 
    u.username || ' ' || u.first_name || ' ' || u.last_name || ' ' || u.city
  )
  @@ websearch_to_tsquery($1)
  {{filter}}
ORDER BY u.created_at DESC
