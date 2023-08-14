import Data from '@socious/data'
import User from '../../models/user/index.js'
import Mission from '../../models/mission/index.js'
import Offer from '../../models/offer/index.js'
import Project from '../../models/project/index.js'
import logger from '../../utils/logging.js'
import ProofSpace from '../proofspace/index.js'
import { addHistory, impactPointsCalculatedWorksIds, getbyMissionId, updateHistoryPoint } from './badges.js'

const RATIO = 0.1

const experienceRatio = (level) => {
  switch (level) {
    case 0:
      return -0.3
    case 1:
      return -0.1
    case 2:
      return 0
    case 3:
      return 0.1
    default:
      return 0
  }
}

export const calculate = ({ category, total_hours, payment_type, experience_level }) => {
  const hourlyWage = category.hourly_wage_dollars

  let totalPoints = hourlyWage * total_hours

  totalPoints += experienceRatio(experience_level) * totalPoints

  const ratioPoints = totalPoints * RATIO

  if (payment_type === Data.ProjectPaymentType.PAID) return ratioPoints

  return totalPoints + ratioPoints
}

export const worker = async ({ mission }) => {
  try {
    mission = await Mission.get(mission.id)
  } catch (err) {
    logger.error(`Mission ${mission.id} ${JSON.stringify(err)}`)
  }

  if (
    mission.project.payment_scheme == Data.ProjectPaymentSchemeType.FIXED &&
    mission.status !== Data.MissionStatus.CONFIRMED
  ) {
    logger.error(`Mission ${mission.id} is not confirmed`)
    return false
  }

  let category
  try {
    category = await Project.jobCategory(mission.project.job_category_id)
  } catch {
    logger.error(
      `Faild canculate impact score for ${mission.id},
      there are no job category for project ${mission.project.id}`
    )
    return false
  }

  let totalHours = 0
  let workId

  if (mission.project.payment_scheme == Data.ProjectPaymentSchemeType.FIXED) {
    const offer = await Offer.get(mission.offer_id)
    totalHours = offer.total_hours
  } else {
    // Hourly basis jobs
    const calculatedWorks = await impactPointsCalculatedWorksIds(mission.id)
    const works = mission.submitted_works?.filter((w) => !calculatedWorks.includes(w.id))

    if (!works || works.length < 1) {
      logger.error(
        `Faild canculate impact score for ${mission.id},
        there are no submitted works for this mission that exists or not calculated already`
      )
      return false
    }
    workId = works[0].id
    totalHours = works[0].total_hours
  }

  if (totalHours < 1) {
    logger.error(`Faild canculate impact score for ${mission.id}, total hours is under 1 hour`)
    return false
  }

  let totalPoints = calculate({
    category,
    total_hours: totalHours,
    payment_type: mission.project.payment_type,
    experience_level: mission.project.experience_level
  })

  if (mission.org_feedback) {
    const ratio = totalPoints * RATIO
    if (mission.org_feedback.is_contest) {
      totalPoints -= ratio
    } else {
      totalPoints += ratio
    }
  }

  if (mission.org_feedback && !mission.org_feedback.is_contest) {
  }

  const socialCause = mission.project.causes_tags[0]

  try {
    const history = await addHistory(mission.assignee_id, {
      mission_id: mission.id,
      total_points: totalPoints,
      social_cause: socialCause,
      social_cause_category: Data.SocialCausesSDGMapping[socialCause],
      submitted_work_id: workId
    })

    logger.info(`Calculate impact point successfully ${history.id}`)

    ProofSpace.Sync({ impact_point_id: history.id })
  } catch (err) {
    logger.error(`Calculating impact points ${err.message}`)
    return false
  }

  return true
}

export const calculateLenders = async ({ amount, is_lender }) => {
  // 10% of lending amount calculate as impact points
  if (is_lender) return amount * 0.1

  // fetch fee from paid amount and 100 % of fee calculate as impact points
  return amount * 0.013
}

export const notStaticfied = async ({ mission }) => {
  const history = await getbyMissionId(mission.id)
  const user = await User.get(history.identity_id)

  const ratio = history.total_points * RATIO
  await updateHistoryPoint({ id: history.id, point: history.total_points - ratio })
  user.impact_points -= ratio
  await User.updateImpactPoints(user)
}

export const staticfied = async ({ mission }) => {
  const history = await getbyMissionId(mission.id)
  const user = await User.get(history.identity_id)

  const ratio = history.total_points * RATIO
  await updateHistoryPoint({ id: history.id, point: history.total_points + ratio })
  user.impact_points -= ratio
  await User.updateImpactPoints(user)
}
