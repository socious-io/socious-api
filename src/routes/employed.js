import Router from '@koa/router';
import Employed from '../models/employed/index.js';
import {loginRequired} from '../utils/middlewares/authorization.js';

import {
  checkIdParams,
  employeer,
  employee,
  employer,
} from '../utils/middlewares/route.js';

export const router = new Router();

router.post(
  '/:id/complete',
  loginRequired,
  checkIdParams,
  employee,
  async (ctx) => {
    await Employed.complete(ctx.params.id);
    ctx.body = {
      message: 'success',
    };
  },
);

router.post(
  '/:id/confirm',
  loginRequired,
  checkIdParams,
  employer,
  async (ctx) => {
    await Employed.confirm(ctx.params.id);
    ctx.body = {
      message: 'success',
    };
  },
);

router.post(
  '/:id/cancel',
  loginRequired,
  checkIdParams,
  employee,
  async (ctx) => {
    await Employed.cancel(ctx.params.id);
    ctx.body = {
      message: 'success',
    };
  },
);

router.post(
  '/:id/kickout',
  loginRequired,
  checkIdParams,
  employer,
  async (ctx) => {
    await Employed.kickout(ctx.params.id);
    ctx.body = {
      message: 'success',
    };
  },
);

router.post(
  '/:id/feedback',
  loginRequired,
  checkIdParams,
  employeer,
  async (ctx) => {
    ctx.body = await Employed.feedback({
      content: ctx.request.body.content,
      is_contest: false,
      identity_id: ctx.identity.id,
      project_id: ctx.employee.project_id,
      employee_id: ctx.employee.id,
    });
  },
);

router.post(
  '/:id/contest',
  loginRequired,
  checkIdParams,
  employeer,
  async (ctx) => {
    ctx.body = await Employed.feedback({
      content: ctx.request.body.content,
      is_contest: true,
      identity_id: ctx.idetity.id,
      project_id: ctx.employee.project_id,
      employee_id: ctx.employee.id,
    });
  },
);
