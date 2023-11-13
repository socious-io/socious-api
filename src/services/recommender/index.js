import axios from 'axios'
import Config from '../../config.js'
import Project from '../../models/project/index.js'
import User from '../../models/user/index.js'
import Applicant from '../../models/applicant/index.js'

const projectToQuery = (project) => {
  return {
    title: project.title,
    description: project.description,
    skills: project.skills
  }
}

export const recommendByProject = async (id) => {
  const p = await Project.get(id)
  const result = await axios.post(Config.ai.job_recommender_url, { query: projectToQuery(p) })
  return Project.getAll(result.data.jobs)
}

export const recommendByUser = async (username) => {
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

  const applies = await Applicant.getByUserId(user.id, { limit: 10, offset: 0, filter: {} })

  query.push(...(applies?.map((a) => projectToQuery(a.project)) || []))

  console.log(query)

  const result = await axios.post(Config.ai.job_recommender_url, { query: query })
  return Project.getAll(result.data.jobs)
}
