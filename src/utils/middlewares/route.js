import Org from '../../models/organization/index.js';
import Chat from '../../models/chat/index.js';
import Project from '../../models/project/index.js';
import Mission from '../../models/mission/index.js';
import Offer from '../../models/offer/index.js';
import Applicant from '../../models/applicant/index.js';
import {validate} from '@socious/data';

export const checkIdParams = async (ctx, next) => {
  const keys = [];

  const params = Object.keys(ctx.params);
  params.filter((p) => p.includes('id')).map((p) => keys.push(p));

  for (const key of keys) {
    await validate.UUID.validateAsync(ctx.params[key]);
  }

  return next();
};

export const chatPermission = async (ctx, next) => {
  await Chat.permissioned(ctx.identity.id, ctx.params.id);
  return next();
};

export const projectPermission = async (ctx, next) => {
  await Project.permissioned(ctx.identity.id, ctx.params.id);
  return next();
};

export const projectOwner = async (ctx, next) => {
  ctx.applicant = await Applicant.projectOwner(ctx.identity.id, ctx.params.id);
  return next();
};

export const applicantOwner = async (ctx, next) => {
  ctx.applicant = await Applicant.owner(ctx.user.id, ctx.params.id);
  return next();
};

export const orgMember = async (ctx, next) => {
  Org.permissioned(ctx.params.id, ctx.user.id);
  return next();
};

export const assigneer = async (ctx, next) => {
  ctx.mission = await Mission.assigneer(ctx.identity.id, ctx.params.id);
  return next();
};

export const assigner = async (ctx, next) => {
  ctx.mission = await Mission.assigner(ctx.identity.id, ctx.params.id);
  return next();
};

export const assignee = async (ctx, next) => {
  ctx.mission = await Mission.assignee(ctx.identity.id, ctx.params.id);
  return next();
};

export const offerPermission = async (ctx, next) => {
  ctx.offer = await Offer.permission(ctx.identity.id, ctx.params.id);
  return next();
};

export const offerer = async (ctx, next) => {
  ctx.offer = await Offer.offerer(ctx.identity.id, ctx.params.id);
  return next();
};

export const recipient = async (ctx, next) => {
  ctx.offer = await Offer.recipient(ctx.identity.id, ctx.params.id);
  return next();
};
