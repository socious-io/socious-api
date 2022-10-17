import Org from '../../models/organization/index.js';
import Chat from '../../models/chat/index.js';
import Project from '../../models/project/index.js';
import Employed from '../../models/employed/index.js';
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

export const employeer = async (ctx, next) => {
  ctx.employee = await Employed.employeer(ctx.identity.id, ctx.params.id);
  return next();
};

export const employer = async (ctx, next) => {
  ctx.employee = await Employed.employer(ctx.identity.id, ctx.params.id);
  return next();
};

export const employee = async (ctx, next) => {
  ctx.employee = await Employed.employee(ctx.identity.id, ctx.params.id);
  return next();
};
