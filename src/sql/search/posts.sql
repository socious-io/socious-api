SELECT
  p.id
FROM posts p
WHERE  
  p.search_tsv @@ websearch_to_tsquery($1)
  {{filter}}
ORDER BY p.created_at DESC
