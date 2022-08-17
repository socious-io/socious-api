SELECT
  COUNT(*) OVER () as total_count,
  c.*, i.type  as identity_type, i.meta as identity_meta, m.id,
  m.id as message_id,
  m.text as message_text
FROM chats c
JOIN chats_participants p ON p.chat_id=c.id
JOIN identities i ON i.id=p.identity_id
LEFT JOIN users u ON u.id=i.id and i.type='users'
LEFT JOIN organizations o ON o.id=i.id and i.type='organizations'
LEFT JOIN messages m ON  m.chat_id = c.id
WHERE  
  to_tsvector(
    'english', 
    c.name || ' ' || c.description || ' ' || m.text || ' ' ||
    COALESCE(u.username, '') || ' ' || COALESCE(u.first_name, '') || ' ' || 
    COALESCE(u.last_name, '') || COALESCE(o.name, '')
  )
  @@ websearch_to_tsquery($1)
ORDER BY p.created_at DESC  LIMIT $2 OFFSET $3
