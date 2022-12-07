import Router from '@koa/router';
import Mission from '../models/mission/index.js';
import Notif from '../models/notification/index.js';
import Event from '../services/events/index.js';
import ImpactPoints from '../services/impact_points/index.js';
import {loginRequired} from '../utils/middlewares/authorization.js';

import {
  checkIdParams,
  assigneer,
  assignee,
  assigner,
} from '../utils/middlewares/route.js';

export const router = new Router();

router.get('/:id', loginRequired, checkIdParams, assigneer, async (ctx) => {
  ctx.body = ctx.mission;
});

router.post(
  '/:id/complete',
  loginRequired,
  checkIdParams,
  assignee,
  async (ctx) => {
    await Mission.complete(ctx.params.id);
    ctx.body = {
      message: 'success',
    };

    const project = ctx.mission.project;

    Event.push(Event.Types.NOTIFICATION, ctx.mission.project.identity_id, {
      type: Notif.Types.PROJECT_COMPLETE,
      refId: ctx.body.id,
      parentId: project.id,
      identity: ctx.identity,
    });
  },
);

router.post(
  '/:id/confirm',
  loginRequired,
  checkIdParams,
  assigner,
  async (ctx) => {
    await Mission.confirm(ctx.params.id);
    ctx.body = {
      message: 'success',
    };

    const project = ctx.mission.project;

    Event.push(Event.Types.NOTIFICATION, ctx.mission.identity_id, {
      type: Notif.Types.ASSIGNER_CONFIRMED,
      refId: ctx.body.id,
      parentId: project.id,
      identity: ctx.identity,
    });

    ImpactPoints.calculate(ctx.mission);

  },
);

router.post(
  '/:id/cancel',
  loginRequired,
  checkIdParams,
  assignee,
  async (ctx) => {
    await Mission.cancel(ctx.params.id);
    ctx.body = {
      message: 'success',
    };

    const project = ctx.mission.project;

    Event.push(Event.Types.NOTIFICATION, ctx.mission.project.identity_id, {
      type: Notif.Types.ASSIGNEE_CANCELED,
      refId: ctx.body.id,
      parentId: project.id,
      identity: ctx.identity,
    });
  },
);

router.post(
  '/:id/kickout',
  loginRequired,
  checkIdParams,
  assigner,
  async (ctx) => {
    await Mission.kickout(ctx.params.id);
    ctx.body = {
      message: 'success',
    };

    const project = ctx.mission.project;

    Event.push(Event.Types.NOTIFICATION, ctx.employee.identity_id, {
      type: Notif.Types.ASSIGNER_CANCELED,
      refId: ctx.body.id,
      parentId: project.id,
      identity: ctx.identity,
    });
  },
);

router.post(
  '/:id/feedback',
  loginRequired,
  checkIdParams,
  assigneer,
  async (ctx) => {
    ctx.body = await Mission.feedback({
      content: ctx.request.body.content,
      is_contest: false,
      identity_id: ctx.identity.id,
      project_id: ctx.mission.project_id,
      mission_id: ctx.mission.id,
    });
  },
);

router.post(
  '/:id/contest',
  loginRequired,
  checkIdParams,
  assigneer,
  async (ctx) => {
    ctx.body = await Mission.feedback({
      content: ctx.request.body.content,
      is_contest: true,
      identity_id: ctx.idetity.id,
      project_id: ctx.mission.project_id,
      mission_id: ctx.mission.id,
    });
  },
);
