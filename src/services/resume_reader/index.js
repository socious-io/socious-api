import { BadRequestError } from '../../utils/errors.js'
import Linkdin from './linkdin.js'
import * as model from './model.js'
import { apply, upsertOrg } from './importer.js'

const read = async ({ identity_id, body, type }) => {
  if (type === 'LINKDIN') {
    const parsed = await Linkdin(body)

    for (const experience of parsed.experiences) {
      const organization = await upsertOrg(experience.company)
      experience.company = organization
    }

    for (const education of parsed.educations) {
      const organization = await upsertOrg(education.name)
      // @ts-ignore
      education.organization = organization
    }

    return await model.insert(identity_id, { body: parsed, type })
  }

  throw new BadRequestError('could not match to type to parse')
}

export default {
  read,
  apply
}
