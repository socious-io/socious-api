import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {ValidationError, PermissionError} from '../../utils/errors.js';

export const members = async (id, {offset = 0, limit = 10}) => {
  const {rows} = await app.db.query(sql`
    SELECT 
    COUNT(*) OVER () as total_count, u.id, u.username, u.email, u.first_name, u.last_name, u.avatar 
    FROM org_members
    INNER JOIN users u ON org_members.user_id=u.id 
    WHERE org_id=${id} ORDER BY org_members.created_at DESC LIMIT ${limit} OFFSET ${offset}`);
  return rows;
};

export const miniMembers = async (id) => {
  const {rows} = await app.db.query(sql`
    SELECT user_id FROM org_members 
    WHERE org_id=${id} ORDER BY created_at`);
  return rows;
};

export const memberExists = async (id, user_id) => {
  const {rows} = await app.db.query(
    sql`SELECT id FROM org_members WHERE org_id=${id} AND user_id=${user_id}`,
  );
  return rows.length > 0;
};

export const addMember = async (id, user_id) => {
  const exists = await memberExists(id, user_id);
  if (exists) throw new ValidationError('Member already exists');

  await app.db.query(
    sql`INSERT INTO org_members (org_id, user_id) VALUES(${id}, ${user_id})`,
  );
};

export const removeMember = async (id, user_id) => {
  const exists = await memberExists(id, user_id);
  if (!exists) throw new ValidationError('Member not exists');

  await app.db.query(
    sql`DELETE FROM org_members WHERE org_id=${id} AND user_id=${user_id}`,
  );
};

export const permissioned = async (id, userId) => {
  // TODO: we can implement complex permission system
  const exists = await memberExists(id, userId);
  if (!exists) throw new PermissionError('Not allow');
};
