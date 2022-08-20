SELECT
  COUNT(*) OVER () as total_count,
  u.id, u.username, u.first_name, u.last_name, u.avatar
FROM users u
WHERE
  u.id <> $4 AND
  to_tsvector(
    'english', 
    u.username || ' ' || u.first_name || ' ' || u.last_name
  )
  @@ websearch_to_tsquery($1)
ORDER BY u.created_at DESC  LIMIT $2 OFFSET $3
