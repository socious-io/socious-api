import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {EntryError, PermissionError} from '../../utils/errors.js';
import {upsertSchem, offerSchem, rejectSchem, answerSchema} from './schema.js';
import {StatusTypes} from './enums.js';
import {get} from './read.js';

export const insert = async (projectId, userId, body) => {
  await upsertSchem.validateAsync(body);
  try {
    const {rows} = await app.db.query(
      sql`
      INSERT INTO applicants (project_id, user_id, cover_letter, payment_type, payment_rate) 
        VALUES (
          ${projectId},
          ${userId}, 
          ${body.cover_letter}, 
          ${body.payment_type},
          ${body.payment_rate}
        )
        RETURNING id`,
    );
    return get(rows[0].id);
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const update = async (id, body) => {
  await upsertSchem.validateAsync(body);

  try {
    const {rows} = await app.db.query(
      sql`
      UPDATE applicants SET
        cover_letter=${body.cover_letter},
        payment_type=${body.payment_type},
        payment_rate=${body.payment_rate}
      WHERE id=${id} AND status=${StatusTypes.PENDING} RETURNING *`,
    );
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const remove = async (id) => {
  await app.db.query(
    sql`DELETE FROM applicants WHERE id=${id} AND status IN (${StatusTypes.PENDING}, ${StatusTypes.WITHDRAW})`,
  );
};

export const withdraw = async (id) => {
  try {
    app.db.get(sql`
    UPDATE applicants SET 
      status=${StatusTypes.WITHDRAWN}
    WHERE id=${id} AND STATUS NOT IN (${StatusTypes.APPROVED}, ${StatusTypes.REJECTED}, ${StatusTypes.HIRED})
    RETURNING *
  `);
  } catch {
    throw PermissionError('not allow');
  }
};

// TODO: affter this update project owner should start payment flow
export const approve = async (id) => {
  return app.db.get(
    sql`UPDATE applicants SET status=${StatusTypes.APPROVED} WHERE id=${id} AND status=${StatusTypes.OFFERED} RETURNING *`,
  );
};

// TODO: before this update should finish payment flow
export const hire = async (id) => {
  return app.db.get(
    sql`UPDATE applicants SET status=${StatusTypes.HIRED} WHERE id=${id} AND status=${StatusTypes.APPROVED} RETURNING *`,
  );
};

export const offer = async (id, body) => {
  await offerSchem.validateAsync(body);

  try {
    const {rows} = await app.db.query(
      sql`
      UPDATE applicants SET
        offer_rate=${body.offer_rate},
        offer_message=${body.offer_message},
        due_date=${body.due_date},
        assignment_total=${body.assignment_total},
        status=${StatusTypes.OFFERED}
      WHERE id=${id} AND status=${StatusTypes.PENDING} RETURNING *`,
    );
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const reject = async (id, body) => {
  await rejectSchem.validateAsync(body);

  try {
    const {rows} = await app.db.query(
      sql`
      UPDATE applicants SET
        feedback=${body.feedback},
        status=${StatusTypes.REJECTED}
      WHERE id=${id} AND status=${StatusTypes.PENDING} RETURNING *`,
    );
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const giveAnswer = async (id, projectId, body) => {
  await answerSchema.validateAsync(body);
  try {
    const {rows} = await app.db.query(sql`
      INSERT INTO answers 
        (project_id, question_id, applicant_id, answer, selected_option)
        VALUES(${projectId}, ${body.id}, ${id}, ${body.answer}, ${body.selected_option})
        RETURNING *
      `);
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const apply = async (projectId, userId, body) => {
  const {rows} = await app.db.query(sql`
    SELECT count(*) FROM questions WHERE project_id=${projectId} and required=true
  `);

  if (parseInt(rows[0]?.count) > body.answers?.length)
    throw new EntryError('answers are not sufficient');

  await app.db.query('BEGIN');
  try {
    const applicant = await insert(projectId, userId, body);

    let answers = [];
    // not worked on promise all
    for (const a of body.answers)
      answers.push(await giveAnswer(applicant.id, projectId, a));

    applicant.answers = answers;

    await app.db.query('COMMIT');
    return applicant;
  } catch (err) {
    await app.db.query('ROLLBACK');
    throw new EntryError(err.message);
  }
};

export const editApply = async (id, body) => {
  await app.db.query('BEGIN');
  try {
    const applicant = await update(id, body);

    const {rows} = await app.db.query(sql`
    SELECT count(*) FROM questions WHERE project_id=${applicant.project_id} and required=true
    `);

    if (parseInt(rows[0]?.count) > body.answers?.length)
      throw new EntryError('answers are not sufficient');

    await app.db.query(sql`DELETE FROM answers WHERE applicant_id=${id}`);

    let answers = [];
    // not worked on promise all
    for (const a of body.answers)
      answers.push(await giveAnswer(applicant.id, applicant.project_id, a));

    applicant.answers = answers;

    await app.db.query('COMMIT');
    return applicant;
  } catch (err) {
    await app.db.query('ROLLBACK');
    throw new EntryError(err.message);
  }
};
