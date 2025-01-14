import { BadRequestError } from '../../utils/errors.js'
import Linkdin from './linkdin.js'
import * as model from './model.js'
import { apply } from './importer.js'
import Org from '../../models/organization/index.js'

const read = async ({ identity_id, body, type }) => {
  if (type === 'LINKDIN') {
    const parsed = await Linkdin(body)

    for (let experience of parsed.experiences) {

      console.log(experience.company)
      const organization = await Org.search(experience.company, {
        offset: 0,
        limit: 1,
        filter: {},
        sort: null,
        currentIdentity: identity_id
      })
      experience.company = organization[0]??null
    }

    return await model.insert(identity_id, { body: parsed, type })
  }

  throw new BadRequestError('could not match to type to parse')
}

export default {
  read,
  apply
}
