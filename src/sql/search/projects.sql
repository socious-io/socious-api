SELECT
  p.id
FROM projects p
WHERE
  p.status = 'ACTIVE' AND
  p.search_tsv @@ websearch_to_tsquery($1)
  {{filter}}
ORDER BY p.created_at DESC
