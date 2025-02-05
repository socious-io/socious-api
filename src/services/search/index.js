import sql from 'sql-template-tag'
import Post from '../../models/post/index.js'
import User from '../../models/user/index.js'
import Org from '../../models/organization/index.js'
import Project from '../../models/project/index.js'
import Applicant from '../../models/applicant/index.js'
import Data from '@socious/data'
import { app } from '../../index.js'
import { BadRequestError } from '../../utils/errors.js'
import { getAll as getAllGeonames } from '../geo/geoname.js'
import { getAll as getAllCountries } from '../geo/country.js'

const addHistory = async (body, identityId) => {
  await app.db.query(sql`
  INSERT INTO search_history (identity_id, body)
  VALUES (${identityId}, ${body})
  `)
}

const find = async (body, { identityId, shouldSave }, paginate) => {
  await Data.SearchSchema.validateAsync(body)
  body.q = body.q?.trim()

  const options = { ...paginate, filter: body.filter, sort: body.sort }

  if (shouldSave) await addHistory(body, identityId)

  switch (body.type) {
    case Data.SearchType.POSTS:
      return body.q ? Post.search(body.q, identityId, options) : Post.all(identityId, options)

    case Data.SearchType.USERS:
      return body.q ? User.search(body.q, identityId, options) : User.getUsers(identityId, options)

    case Data.SearchType.APPLICANTS:
      return body.q ? Applicant.search(body.q, identityId, options) : Applicant.allByIdentity(identityId, options)

    case Data.SearchType.RELATED_USERS:
      return body.q ? User.searchRelateds(body.q, identityId, options) : User.getRelateds(identityId, options)

    case Data.SearchType.PROJECTS:
      return body.q ? Project.search(body.q, options) : Project.all(identityId, options)

    case Data.SearchType.ORGANIZATIONS:
      return body.q ? Org.search(body.q, { ...options, currentIdentity: identityId }) : Org.all(options)

    default:
      throw new BadRequestError(`type '${body.type}' is not valid`)
  }
}

const findV2 = async (body, ids, { identityId, shouldSave }, paginate) => {
  // await Data.SearchV2Schema.validateAsync(body)

  const options = { ...paginate, filter: body.filter }

  if (shouldSave) await addHistory(body, identityId)

  switch (body.type) {
    case Data.SearchV2Type.USERS:
      return User.getAllProfile(ids, options.sort, identityId)

    case Data.SearchV2Type.PROJECTS:
      return Project.getAll(ids, identityId)

    case Data.SearchV2Type.ORGANIZATIONS:
      return Org.getAll(ids, identityId)

    case Data.SearchV2Type.LOCATIONS: {
      const countries = (await getAllCountries(ids)).map((country) => {
          return {
            ...country,
            locations_type: 'country'
          }
        }),
        geonames = (await getAllGeonames(ids)).map((place) => {
          return {
            ...place,
            locations_type: 'geoname'
          }
        })

      return [...countries, ...geonames]
    }
    default:
      throw new BadRequestError(`type '${body.type}' is not valid`)
  }
}

const history = async (identityId, { offset = 0, limit = 10 }) => {
  const { rows } = await app.db.query(sql`
  SELECT COUNT(*) OVER () as total_count, *
  FROM search_history WHERE identity_id=${identityId}
  ORDER BY created_at desc LIMIT ${limit} OFFSET ${offset}
  `)
  return rows
}

export default {
  find,
  findV2,
  history,
  addHistory
}
