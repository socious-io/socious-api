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
    const org = await upsertOrg(exp.company)
    // @ts-ignore
    await User.addExperience(user, {
      org_id: org.id,
      title: exp.job,
      description: exp.description,
      start_at: exp.start_date,
      end_at: exp.end_date
    })
  }
  for (const edu of body.educations) {
    const org = await upsertOrg(edu.name)
    await User.addEducation(user, {
      org_id: org.id,
      description: null,
      title: edu.name,
      degree: edu.degree,
      grade: edu.grade,
      start_at: new Date(edu.start_at),
      end_at: new Date(edu.end_at)
    })
  }
  // @ts-ignore
  await User.updateProfile(user.id, { ...user, mission: body.summary, skills: await getSkills(body.skills) })

  await model.update(identityId, { body, status: 'APPLIED' })
}

const upsertOrg = async (name) => {
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
      return { ...s, ratio: ratio(s.name.toLowerCase().replaceAll('_', ' ').toLowerCase(), s.name) }
    })
    .filter((s) => s.ratio >= FUZZY_TRESHHOLD)
    .sort((a, b) => b.ratio - a.ratio)
}
