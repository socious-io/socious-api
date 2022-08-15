import Router from '@koa/router';
import Body from 'koa-body';
import Media from '../models/media/index.js';
import Upload from '../utils/upload.js';

import {identity} from '../utils/requests.js';

const koaBody = Body({multipart: true, uploadDir: '.'});

export const router = new Router();

/**
 * @api {post} /media/upload Upload
 * @apiGroup Media
 * @apiName Upload
 * @apiVersion 2.0.0
 * @apiDescription Upload media
 * @apiPermission LoginRequired
 *
 * @apiBody {File} file
 *
 * @apiSuccess (200) {String} id
 * @apiSuccess (200) {String} filename
 * @apiSuccess (200) {String} url
 * @apiSuccess (200) {Datetime} created_at
 */

router.post('/upload', koaBody, identity, async (ctx) => {
  const {originalFilename, filepath, mimetype} = ctx.request.files.file;
  const mediaUrl = await Upload(filepath, mimetype);

  ctx.body = await Media.insert(ctx.identity.id, originalFilename, mediaUrl);
});
