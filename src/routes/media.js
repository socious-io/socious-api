import Router from '@koa/router';
import Body from 'koa-body';
import Media from '../models/media/index.js';
import Upload from '../utils/upload.js';

import {BadRequestError} from '../utils/errors.js';
import {
  loginOptional,
  loginRequired,
} from '../utils/middlewares/authorization.js';
import {checkIdParams} from '../utils/middlewares/route.js';

const koaBody = Body({multipart: true, uploadDir: '.'});

export const router = new Router();

router.post('/upload', loginRequired, koaBody, async (ctx) => {
  if (!ctx.request.files.file) throw new BadRequestError('file is required');
  const {originalFilename, filepath, mimetype} = ctx.request.files.file;
  const mediaUrl = await Upload(filepath, mimetype);

  ctx.body = await Media.insert(ctx.identity.id, originalFilename, mediaUrl);
});

router.get('/:id', loginOptional, checkIdParams, async (ctx) => {
  ctx.body = await Media.get(ctx.params.id);
});

router.post('/', loginRequired, async (ctx) => {
  ctx.body = {items: await Media.getAll(ctx.request.body.ids)};
});
