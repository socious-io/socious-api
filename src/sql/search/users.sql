SELECT
  u.id
FROM users u
WHERE
  u.id <> $2 AND
  to_tsvector(
    'english', 
    u.username || ' ' ||
    u.first_name || ' ' ||
    u.last_name || ' ' ||
    u.city
  )
  @@ websearch_to_tsquery($1)
  {{filter}}
ORDER BY u.created_at DESC
