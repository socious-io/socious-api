import Project from '../../models/project/index.js'
import User from '../../models/user/index.js'
import Applicant from '../../models/applicant/index.js'
import { getRecommendeds, recommended, getRecommendedProjectIds, getSimilarProjectIds } from './model.js'

export const recommendProjectByProject = async (id) => {
  const p = await Project.get(id)
  const ids = await getSimilarProjectIds(p.skills, p.causes_tags, id, 10)
  if (ids.length === 0) return []
  return Project.getAll(ids)
}

export const recommendProjectByUser = async (username, options) => {
  const user = await User.getByUsername(username)
  const recommends = await getRecommendeds(user.id, 'projects', options)

  let newRecommends = recommends.length < 3

  if (recommends.length > 0) {
    const now = new Date()
    const recommendDate = new Date(recommends[0].updated_at)
    const timeDiff = now.getTime() - recommendDate.getTime()
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
    newRecommends = daysDiff >= 7
  }
  if (!newRecommends)
    return Project.getAll(
      recommends.map((r) => r.entity_id),
      user.id
    )

  const applies = await Applicant.getByUserId(user.id, { limit: 10, offset: 0, filter: {}, sort: '-created_at' })

  const [saves, notIntresteds] = await Promise.all([
    Project.getMarkedProjects(user.id, 'SAVE'),
    Project.getMarkedProjects(user.id, 'NOT_INTERESTED')
  ])

  const excludeIds = [
    ...(applies?.map((a) => a.project_id) || []),
    ...notIntresteds.map((m) => m.project_id)
  ]

  const savedIds = saves.map((m) => m.project_id)

  const ids = await getRecommendedProjectIds(user, excludeIds, savedIds, 20)
  if (ids.length === 0) return []

  const projects = await Project.getAll(ids, user.id)
  let saved = []
  let i = 1
  for (const p of projects) {
    saved.push(recommended(user.id, p.id, 'projects', i))
    i++
  }
  await Promise.all(saved)
  return projects
}

export const recommendUserByUser = async () => {
  return []
}

export const recommendUserByOrg = async () => {
  return []
}

export const recommendOrgByUser = async () => {
  return []
}

export const recommendOrgByOrg = async () => {
  return []
}
