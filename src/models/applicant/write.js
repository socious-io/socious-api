import sql from 'sql-template-tag';
import {app} from '../../index.js';
import {EntryError, PermissionError} from '../../utils/errors.js';
import Data from '@socious/data';
import {get} from './read.js';

const StatusTypes = Data.ApplicantStatus;

export const insert = async (
  projectId,
  userId,
  {
    cover_letter,
    payment_type,
    payment_rate,
    cv_link,
    cv_name,
    share_contact_info,
    attachment,
  },
) => {
  try {
    const {rows} = await app.db.query(
      sql`
      INSERT INTO applicants (
        project_id, user_id, cover_letter, payment_type, payment_rate,
        cv_link, cv_name, share_contact_info, attachment
        ) 
        VALUES (
          ${projectId},
          ${userId}, 
          ${cover_letter}, 
          ${payment_type},
          ${payment_rate},
          ${cv_link},
          ${cv_name},
          ${share_contact_info},
          ${attachment}
        )
        RETURNING id`,
    );
    return get(rows[0].id);
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const update = async (
  id,
  {
    cover_letter,
    payment_type,
    payment_rate,
    cv_link,
    cv_name,
    share_contact_info,
    attachment,
  },
) => {
  try {
    const {rows} = await app.db.query(
      sql`
      UPDATE applicants SET
        cover_letter=${cover_letter},
        payment_type=${payment_type},
        payment_rate=${payment_rate}
        cv_link=${cv_link},
        cv_name=${cv_name},
        share_contact_info=${share_contact_info},
        attachment=${attachment}
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

export const withdrawn = async (id) => {
  try {
    return app.db.get(sql`
    UPDATE applicants SET 
      status=${StatusTypes.WITHDRAWN}
    WHERE id=${id} AND status NOT IN (${StatusTypes.APPROVED}, ${StatusTypes.REJECTED}, ${StatusTypes.HIRED})
    RETURNING *
  `);
  } catch {
    throw PermissionError('not allow');
  }
};

export const offer = async (id) => {
  return app.db.get(
    sql`UPDATE applicants SET status=${StatusTypes.OFFERED} WHERE id=${id} RETURNING *`,
  );
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

export const reject = async (id, {feedback}) => {
  try {
    const {rows} = await app.db.query(
      sql`
      UPDATE applicants SET
        feedback=${feedback},
        status=${StatusTypes.REJECTED}
      WHERE id=${id} AND status=${StatusTypes.PENDING} RETURNING *`,
    );
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const giveAnswer = async (
  applicantId,
  projectId,
  {id, answer, selected_option},
) => {
  try {
    const {rows} = await app.db.query(sql`
      INSERT INTO answers 
        (project_id, question_id, applicant_id, answer, selected_option)
        VALUES(${projectId}, ${id}, ${applicantId}, ${answer}, ${selected_option})
        RETURNING *
      `);
    return rows[0];
  } catch (err) {
    throw new EntryError(err.message);
  }
};

export const apply = async (
  projectId,
  userId,
  {
    answers = [],
    cover_letter,
    payment_type,
    payment_rate,
    cv_link,
    cv_name,
    share_contact_info,
    attachment,
  },
) => {
  const {rows} = await app.db.query(sql`
    SELECT count(*) FROM questions WHERE project_id=${projectId} and required=true
  `);

  if (parseInt(rows[0]?.count) > answers?.length)
    throw new EntryError('answers are not sufficient');

  await app.db.query('BEGIN');
  try {
    const applicant = await insert(projectId, userId, {
      cover_letter,
      payment_rate,
      payment_type,
      cv_link,
      cv_name,
      share_contact_info,
      attachment,
    });
    let answersResult = [];
    // not worked on promise all
    for (const a of answers)
      answersResult.push(await giveAnswer(applicant.id, projectId, a));

    applicant.answers = answersResult;

    await app.db.query('COMMIT');
    return applicant;
  } catch (err) {
    await app.db.query('ROLLBACK');
    throw new EntryError(err.message);
  }
};

export const editApply = async (
  id,
  {
    answers = [],
    cover_letter,
    payment_type,
    payment_rate,
    cv_link,
    cv_name,
    share_contact_info,
    attachment,
  },
) => {
  await app.db.query('BEGIN');
  try {
    const applicant = await update(id, {
      cover_letter,
      payment_type,
      payment_rate,
      cv_link,
      cv_name,
      share_contact_info,
      attachment,
    });

    const {rows} = await app.db.query(sql`
    SELECT count(*) FROM questions WHERE project_id=${applicant.project_id} and required=true
    `);

    if (parseInt(rows[0]?.count) > answers?.length)
      throw new EntryError('answers are not sufficient');

    await app.db.query(sql`DELETE FROM answers WHERE applicant_id=${id}`);

    let answersResult = [];
    // not worked on promise all
    for (const a of answers)
      answersResult.push(
        await giveAnswer(applicant.id, applicant.project_id, a),
      );

    applicant.answers = answers;

    await app.db.query('COMMIT');
    return applicant;
  } catch (err) {
    await app.db.query('ROLLBACK');
    throw new EntryError(err.message);
  }
};
