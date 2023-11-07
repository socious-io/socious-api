import Router from '@koa/router'
import { geoip } from '../services/geo/geoip.js'
import { locationsByCountry, locationsSearchByCountry, locationsSearch } from '../services/geo/geoname.js'
import { paginate } from '../utils/middlewares/requests.js'
import { BadRequestError } from '../utils/errors.js'

export const router = new Router()

router.get('/ip', async (ctx) => {
  ctx.body = await geoip(ctx.query.ip || ctx.request.ip)
})

router.get('/locations/country/:countryCode', paginate, async (ctx) => {
  const { countryCode } = ctx.params
  if (countryCode?.length !== 2 || countryCode === 'XW') {
    ctx.body = []
  } else if (ctx.query.search) {
    ctx.body = await locationsSearchByCountry(countryCode, ctx.query.search, ctx.paginate)
  } else {
    ctx.body = await locationsByCountry(countryCode, ctx.paginate)
  }
})

router.get('/locations', paginate, async (ctx) => {
  if (!ctx.query.search) throw new BadRequestError('search need to be valid string')
  ctx.body = await locationsSearch(ctx.query.search, ctx.paginate)
})
