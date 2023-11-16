import axios from 'axios'
import Config from '../../config.js'
import Project from '../../models/project/index.js'
import User from '../../models/user/index.js'
import Applicant from '../../models/applicant/index.js'
import Organization from '../../models/organization/index.js'

const projectToQuery = (project) => {
  return {
    title: project.title,
    description: project.description,
    skills: project.skills
  }
}

export const recommendProjectByProject = async (id) => {
  const p = await Project.get(id)
  const result = await axios.post(Config.ai.job_recommender_url, { query: projectToQuery(p) })
  return Project.getAll(result.data.jobs)
}

export const recommendProjectByUser = async (username) => {
  const user = await User.getByUsername(username)
  const query = [
    {
      mission: user.mission,
      bio: user.bio,
      skills: user.skills,
      social_causes: user.social_causes,
      country: user.country
    }
  ]

  const applies = await Applicant.getByUserId(user.id, { limit: 10, offset: 0, filter: {}, sort: '-created_at' })

  query.push(...(applies?.map((a) => projectToQuery(a.project)) || []))

  const result = await axios.post(Config.ai.jobs_recommender_url, { query: query })
  return Project.getAll(result.data.jobs)
}

export const recommendUserByUser = async (username) => {
  const user = await User.getByUsername(username)
  const query = [
    {
      mission: user.mission,
      bio: user.bio,
      skills: user.skills,
      social_causes: user.social_causes,
      country: user.country
    }
  ]

  const applies = await Applicant.getByUserId(user.id, { limit: 5, offset: 0, filter: {}, sort: '-created_at' })

  query.push(...(applies?.map((a) => projectToQuery(a.project)) || []))

  const result = await axios.post(Config.ai.talents_recommender_url, { query: query })
  return User.getAllProfile(result.data.talents, '-impact_points', user.id)
}

export const recommendUserByOrg = async (shortname) => {
  const org = await Organization.getByShortname(shortname)
  const query = [
    {
      mission: org.mission,
      bio: org.bio,
      skills: org.skills,
      social_causes: org.social_causes,
      country: org.country
    }
  ]

  const projects = await Project.all({ limit: 3, offset: 0, filter: { identity_id: org.id }, sort: '-created_at' })

  query.push(...(projects?.map((p) => projectToQuery(p)) || []))

  const result = await axios.post(Config.ai.talents_recommender_url, { query: query })
  return User.getAllProfile(result.data.talents, '-impact_points', org.id)
}

export const recommendOrgByUser = async (username) => {
  const user = await User.getByUsername(username)
  const query = [
    {
      mission: user.mission,
      bio: user.bio,
      skills: user.skills,
      social_causes: user.social_causes,
      country: user.country
    }
  ]

  const applies = await Applicant.getByUserId(user.id, { limit: 10, offset: 0, filter: {}, sort: '-created_at' })

  query.push(...(applies?.map((a) => projectToQuery(a.project)) || []))

  const result = await axios.post(Config.ai.orgs_recommender_url, { query: query })
  return Organization.getAll(result.data.orgs)
}

export const recommendOrgByOrg = async (shortname) => {
  const org = await Organization.getByShortname(shortname)
  const query = [
    {
      mission: org.mission,
      bio: org.bio,
      skills: org.skills,
      social_causes: org.social_causes,
      country: org.country
    }
  ]

  const projects = await Project.all({ limit: 3, offset: 0, filter: { identity_id: org.id }, sort: '-created_at' })

  query.push(...(projects?.map((p) => projectToQuery(p)) || []))

  const result = await axios.post(Config.ai.orgs_recommender_url, { query: query })
  return Organization.getAll(result.data.orgs)
}
