import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {ValidationError, PermissionError} from '../../utils/errors.js';

export const members = async (id) => {
  const {rows} = await app.db.query(sql`
    SELECT 
      u.username, u.email, u.first_name, u.last_name 
    FROM org_members INNER JOIN users u ON org_members.user_id=u.id 
    WHERE org_id=${id}`)
  return rows
};


export const memberExists = async (id, user) => {
  const {rows} = await app.db.query(sql`SELECT id FROM org_members WHERE id=${id} AND user_id=${user.id}`);
  return rows.length > 1;
};


export const addMember = async (id, user) => {
  const exists = await memberExists(id, user);
  if (exists) throw ValidationError('Member already exists')

  await app.db.query(sql`INSERT INTO org_members (org_id, user_id) VALUES(${id}, ${user.id})`)
};

export const removeMember = async (id, user) => {
  const exists = await memberExists(id, user);
  if (!exists) throw ValidationError('Member not exists')

  await app.db.query(sql`DELETE FROM org_members WHERE id=${id} AND user_id=${user.id}`)
};


export const permissionedMember = async (id, user) => {
  // TODO: we can implement complex permission system
  const exists = await memberExists(id, user)
  if (exists) throw PermissionError('Not allow')
}
