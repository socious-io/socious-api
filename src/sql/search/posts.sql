SELECT
  COUNT(*) OVER () as total_count,
  p.*, i.type  as identity_type, i.meta as identity_meta,
  array_to_json(p.causes_tags) as causes_tags
FROM posts p
JOIN identities i ON i.id=p.identity_id
LEFT JOIN users u ON u.id=i.id and i.type='users'
LEFT JOIN organizations o ON o.id=i.id and i.type='organizations'
WHERE  
  to_tsvector(
    'english', 
    p.content || ' ' || 
    array_to_string(p.hashtags, ' ') ||  ' ' ||
    array_to_string(p.causes_tags, ' ') || ' ' ||
    COALESCE(u.username, '') || ' ' ||
    COALESCE(u.first_name, '') || ' ' || COALESCE(u.last_name, '') || COALESCE(o.name, '')
    )
  @@ websearch_to_tsquery($1)
ORDER BY p.created_at DESC  LIMIT $2 OFFSET $3
