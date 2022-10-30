import Router from '@koa/router';
import {PermissionError} from '../utils/errors.js';
import Applicant from '../models/applicant/index.js';
import Offer from '../models/offer/index.js';
import Notif from '../models/notification/index.js';
import Event from '../services/events/index.js';

import {loginRequired} from '../utils/middlewares/authorization.js';
import {offerer, recipient, checkIdParams} from '../utils/middlewares/route.js';

export const router = new Router();

router.post(
  '/:id/withdrawn',
  loginRequired,
  checkIdParams,
  recipient,
  async (ctx) => {
    ctx.body = Offer.withdrawn(ctx.params.id);
    if (ctx.offer.applicant_id)
      await Applicant.withdrawn(ctx.offer.applicant_id);
  },
);

router.post(
  '/:id/approve',
  loginRequired,
  checkIdParams,
  recipient,
  async (ctx) => {
    ctx.body = Offer.approve(ctx.params.id);
    if (ctx.offer.applicant_id) await Applicant.approve(ctx.offer.applicant_id);

    Event.push(Event.Types.NOTIFICATION, ctx.offer.offerer_id, {
      type: Notif.Types.APPROVED,
      refId: ctx.body.id,
      parentId: ctx.offer.project_id,
      identity: ctx.identity,
    });
  },
);

router.post(
  '/:id/cancel',
  loginRequired,
  checkIdParams,
  offerer,
  async (ctx) => {
    ctx.body = Offer.cancel(ctx.params.id);
  },
);

router.post('/:id/hire', loginRequired, checkIdParams, offerer, async (ctx) => {
  if (ctx.offer.project.total_escrow_amount < ctx.offer.assignment_total)
    throw new PermissionError();

  ctx.body = Offer.hire(ctx.params.id);

  Event.push(Event.Types.NOTIFICATION, ctx.offer.recipient_id, {
    type: Notif.Types.HIRED,
    refId: ctx.body.id,
    parentId: ctx.offer.project_id,
    identity: ctx.identity,
  });
});
