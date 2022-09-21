SELECT
  p.id
FROM projects p
JOIN identities i ON i.id=p.identity_id
LEFT JOIN users u ON u.id=i.id and i.type='users'
LEFT JOIN organizations o ON o.id=i.id and i.type='organizations'
WHERE
  p.status = 'ACTIVE' AND
  to_tsvector(
    'english', 
    p.title || ' ' || p.description || ' ' ||
    COALESCE(u.username, '') || ' ' ||
    COALESCE(u.first_name, '') || ' ' || COALESCE(u.last_name, '') || COALESCE(o.name, '')
    )
  @@ websearch_to_tsquery($1)
  {{filter}}
ORDER BY p.created_at DESC
