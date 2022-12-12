import Data from '@socious/data';
import Mission from '../../models/mission/index.js';
import Offer from '../../models/offer/index.js';
import Project from '../../models/project/index.js';
import logger from '../../utils/logging.js';
import {addHistory} from './badges.js';

const RATIO = 0.1;

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
  category,
  total_hours,
  payment_type,
  experience_level,
}) => {
  let hourlyWage = category.hourly_wage_dollars;

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
  let category;
  try {
    category = await Project.jobCategory(mission.project.job_category_id);
  } catch {
    logger.error(
      `Faild canculate impact score for ${mission.id},
      there are no job category for project ${mission.project.id}`,
    );
    return false;
  }

  const offer = await Offer.get(mission.offer_id);

  const totalPoints = calculate({
    category,
    total_hours: offer.total_hours,
    payment_type: mission.project.payment_type,
    experience_level: mission.project.experience_level,
  });

  const socialCause = mission.project.causes_tags[0];

  try {
    const history = await addHistory(mission.assignee_id, {
      mission_id: mission.id,
      total_points: totalPoints,
      social_cause: socialCause,
      social_cause_category: Data.SocialCausesSDGMapping[socialCause],
    });

    logger.info(`Calculate impact point successfully ${history.id}`);
  } catch (err) {
    logger.error(`Calculating impact points ${err.message}`);
    return false;
  }

  return true;
};
