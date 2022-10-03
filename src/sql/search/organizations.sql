SELECT
  org.id
FROM organizations org
WHERE
  org.status = 'ACTIVE' AND
  search_tsv @@ websearch_to_tsquery($1)
  {{filter}}
ORDER BY created_at DESC
