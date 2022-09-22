SELECT
  org.id
FROM organizations org
WHERE
  org.status = 'ACTIVE' AND
  to_tsvector(
    'english', 
    email || ' ' || 
    name || ' ' ||
    bio || ' ' ||
    description || ' ' ||
    city
    )
  @@ websearch_to_tsquery($1)
  {{filter}}
ORDER BY created_at DESC
