import Router from '@koa/router';
import {validate} from '@socious/data';
import Org from '../models/organization/index.js';
import {
  loginOptional,
  loginRequired,
} from '../utils/middlewares/authorization.js';
import {checkIdParams, orgMember} from '../utils/middlewares/route.js';
import {paginate} from '../utils/middlewares/requests.js';
export const router = new Router();

router.get('/:id', loginOptional, checkIdParams, async (ctx) => {
  ctx.body = await Org.get(ctx.params.id);
});

router.get('/by-shortname/:shortname', loginOptional, async (ctx) => {
  ctx.body = await Org.getByShortname(ctx.params.shortname);
});

router.get('/', loginOptional, paginate, async (ctx) => {
  ctx.body = await Org.all(ctx.paginate);
});

router.post('/', loginRequired, async (ctx) => {
  await validate.OrganizationSchema.validateAsync(ctx.request.body);
  ctx.body = await Org.insert(ctx.user.id, ctx.request.body);
  await Org.addMember(ctx.body.id, ctx.user.id);
});

router.get('/check', loginRequired, async (ctx) => {
  ctx.body = {
    shortname_exists: await Org.shortNameExists(ctx.query.shortname),
  };
});

router.post(
  '/update/:id',
  loginRequired,
  checkIdParams,
  orgMember,
  async (ctx) => {
    await validate.OrganizationSchema.validateAsync(ctx.request.body);
    ctx.body = await Org.update(ctx.params.id, ctx.request.body);
  },
);

router.get(
  '/:id/members',
  loginRequired,
  checkIdParams,
  paginate,
  async (ctx) => {
    ctx.body = await Org.members(ctx.params.id, ctx.paginate);
  },
);

router.post(
  '/:id/members/:user_id',
  loginRequired,
  checkIdParams,
  orgMember,
  async (ctx) => {
    await Org.addMember(ctx.params.id, ctx.params.user_id);
    ctx.body = {message: 'success'};
  },
);

router.post(
  '/remove/:id/members/:user_id',
  loginRequired,
  checkIdParams,
  orgMember,
  async (ctx) => {
    await Org.removeMember(ctx.params.id, ctx.params.user_id);
    ctx.body = {message: 'success'};
  },
);
