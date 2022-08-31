import Router from '@koa/router';
import Body from 'koa-body';
import Media from '../models/media/index.js';
import Upload from '../utils/upload.js';

import {identity} from '../utils/requests.js';
import { BadRequestError } from '../utils/errors.js';

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
  if (!ctx.request.files.file) 
    throw new BadRequestError('file is required')
  const {originalFilename, filepath, mimetype} = ctx.request.files.file;
  const mediaUrl = await Upload(filepath, mimetype);

  ctx.body = await Media.insert(ctx.identity.id, originalFilename, mediaUrl);
});

/**
 * @api {get} /media/:id Get
 * @apiGroup Media
 * @apiName Get
 * @apiVersion 2.0.0
 * @apiDescription Get media
 * @apiPermission LoginRequired
 *
 * @apiParam {String} id
 *
 * @apiSuccess (200) {String} id
 * @apiSuccess (200) {String} filename
 * @apiSuccess (200) {String} url
 * @apiSuccess (200) {Datetime} created_at
 */

router.get('/:id', async (ctx) => {
  ctx.body = await Media.get(ctx.params.id);
});

/**
 * @api {POST} /media Get all
 * @apiGroup Media
 * @apiName GetAll
 * @apiVersion 2.0.0
 * @apiDescription Upload media
 * @apiPermission LoginRequired
 *
 * @apiBody {String[]} ids
 *
 * @apiSuccess (200) {Objects} items
 * @apiSuccess (200) {String} items.id
 * @apiSuccess (200) {String} items.filename
 * @apiSuccess (200) {String} items.url
 * @apiSuccess (200) {Datetime} items.created_at
 */

router.post('/', async (ctx) => {
  ctx.body = {items: await Media.getAll(ctx.request.body.ids)};
});
