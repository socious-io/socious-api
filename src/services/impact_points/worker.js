import sql from 'sql-template-tag';
import Data from '@socious/data';
import Mission from '../../models/mission/index.js';
import Offer from '../../models/offer/index.js';
import Skill from '../../models/skill/index.js';
import {app} from '../../index.js';
import logger from '../../utils/logging.js';

const RATIO = 0.1;

const fetchJobCategory = async (names) => {
  const skills = await Skill.getAllByNames(names);

  const {rows} = await app.db.query(sql`
    SELECT * FROM job_categories WHERE id=ANY(${skills.map(
      (s) => s.job_category_id,
    )})
  `);

  return rows;
};

const experienceRatio = (level) => {
  switch (level) {
    case 0:
      return -0.3;
    case 1:
      return -0.1;
    case 2:
      return 0;
    case 3:
      return 0.1;
    default:
      return 0;
  }
};

export const calculate = ({
  categories,
  total_hours,
  payment_type,
  experience_level,
}) => {
  let hourlyWage = 0;
  for (const cat of categories) hourlyWage += cat.hourly_wage_dollars;

  let totalPoints = hourlyWage * total_hours;

  totalPoints += experienceRatio(experience_level) * totalPoints;

  const ratioPoints = totalPoints * RATIO;

  if (payment_type === Data.ProjectPaymentType.PAID) return ratioPoints;

  return totalPoints + ratioPoints;
};

export const worker = async ({mission}) => {
  mission = await Mission.get(mission.id);

  if (mission.status !== Data.MissionStatus.CONFIRMED) {
    logger.error(`Mission ${mission.id} is not confirmed`);
    return false;
  }

  const categories = await fetchJobCategory(mission.project.skills);

  if (categories.length < 1) {
    logger.error(
      `Faild canculate impact score for ${
        mission.id
      } there are no job category for skills ${mission.project.skills.join(
        ',',
      )}`,
    );
    return false;
  }

  const offer = await Offer.get(mission.offer_id);

  const totalPoints = calculate({
    categories,
    total_hours: offer.total_hours,
    payment_type: mission.project.payment_type,
    experience_level: mission.project.experience_level,
  });

  const socialCause = mission.project.causes_tags[0];

  try {
    const history = await app.db.get(sql`
      INSERT INTO impact_points_history (total_points, mission_id, identity_id, social_cause, social_cause_category)
      VALUES (${totalPoints}, ${mission.id}, ${mission.assignee_id}, ${socialCause}, ${Data.SocialCausesSDGMapping[socialCause]})
      RETURNING id
    `);
    logger.info(`Calculate impact point successfully ${history.id}`);
  } catch (err) {
    logger.error(`Calculating impact points ${err.message}`);
    return false;
  }

  return true;
};
