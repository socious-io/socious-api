import { ratio } from 'fuzzball'
import Org from '../../models/organization/index.js'
import User from '../../models/user/index.js'
import Skill from '../../models/skill/index.js'
import * as model from './model.js'

const FUZZY_TRESHHOLD = 70

export const apply = async (identityId, modelId) => {
  const imports = await model.get(modelId, identityId)
  if (imports.status !== 'PENDING') return
  const user = await User.get(identityId)
  const body = imports.body

  for (const exp of body.experiences) {
    // @ts-ignore
    await User.addExperience(user, {
      org_id: exp.company.id,
      title: exp.job,
      description: exp.description,
      start_at: exp.start_date != null ? new Date(exp.start_date) : null,
      end_at: exp.end_date != null ? new Date(exp.end_date) : null
    })
  }
  for (const edu of body.educations) {
    await User.addEducation(user, {
      org_id: edu.organization.id,
      description: null,
      title: edu.name,
      degree: edu.degree,
      grade: edu.grade,
      start_at: edu.start_at != null ? new Date(edu.start_at) : null,
      end_at: edu.end_at != null ? new Date(edu.end_at) : null
    })
  }
  // @ts-ignore
  await User.updateProfile(user.id, { ...user, mission: body.summary, skills: await getSkills(body.skills) })

  await model.update(identityId, { body, status: 'APPLIED' })
}

export const upsertOrg = async (name) => {
  let orgs = await Org.search(name, {
    offset: 0,
    limit: 5,
    sort: '-created_at',
    filter: {},
    currentIdentity: undefined
  })
  orgs = orgs
    .map((o) => {
      return { ...o, ratio: ratio(o.name.toLowerCase(), name.toLowerCase()) }
    })
    .filter((o) => o.ratio >= FUZZY_TRESHHOLD)
    .sort((a, b) => b.ratio - a.ratio)

  let org = orgs[0]
  if (!org) {
    let shortname = Org.generateShortname(name)
    while (await Org.shortNameExists(shortname)) {
      shortname = Org.generateShortname()
    }
    org = await Org.insert(undefined, { shortname, name })
  }
  return org
}

const getSkills = async (bodySkills) => {
  let skills = await Skill.all({ offset: 0, limit: 2000 })

  return skills
    .map((s) => {
      let bestMatch = null
      let bestRatio = 0
      bodySkills.forEach((b) => {
        if (ratio(s.name.toLowerCase().replaceAll('_', ' ').toLowerCase(), b) > bestRatio) {
          bestMatch = s.name
        }
      })
      return { name: bestMatch, ratio: bestRatio }
    })
    .filter((s) => s.ratio >= FUZZY_TRESHHOLD)
    .sort((a, b) => b.ratio - a.ratio)
    .map((s) => s.name)
}
