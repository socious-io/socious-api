SELECT
  p.id
FROM projects p
JOIN identities i ON i.id=p.identity_id
LEFT JOIN users u ON u.id=i.id and i.type='users'
LEFT JOIN organizations o ON o.id=i.id and i.type='organizations'
WHERE
  p.status = 'ACTIVE' AND
  p.search_tsv @@ websearch_to_tsquery($1)
  {{filter}}
ORDER BY p.created_at DESC
