/* eslint-disable no-unreachable */
import Router from '@koa/router';
import Event from '../services/events/index.js';
import Chat from '../models/chat/index.js';
import {paginate, identity} from '../utils/requests.js';
import {NotImplementedError} from '../utils/errors.js';
export const router = new Router();

/**
 * @api {get} /chats Get summary
 * @apiGroup Chat
 * @apiName Get summary
 * @apiVersion 2.0.0
 * @apiDescription get chats with additional information
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiQuery {Number} page default 1
 * @apiQuery {Number{min: 1}} limit=10
 * @apiQuery {String} filter to search for other participants by name
 *
 * @apiSuccess (200) {Number} page
 * @apiSuccess (200) {Number} limit
 * @apiSuccess (200) {Number} total_count
 * @apiSuccess (200) {Object[]} items
 * @apiSuccess (200) {String} items.id
 * @apiSuccess (200) {String} items.name
 * @apiSuccess (200) {String} items.description
 * @apiSuccess (200) {String} items.type
 * @apiSuccess (200) {Datetime} items.created_at
 * @apiSuccess (200) {Datetime} items.updated_at
 */
router.get('/summary', identity, paginate, async (ctx) => {
  const {filter} = ctx.query;
  ctx.body = await Chat.summary(ctx.identity.id, ctx.paginate, filter);
});

/**
 * @api {get} /chats/:id Get
 * @apiGroup Chat
 * @apiName Get
 * @apiVersion 2.0.0
 * @apiDescription get chat
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 * @apiParam {String} id
 *
 * @apiSuccess (200) {String} id
 * @apiSuccess (200) {String} name
 * @apiSuccess (200) {String} description
 * @apiSuccess (200) {String} type
 * @apiSuccess (200) {Datetime} created_at
 * @apiSuccess (200) {Datetime} updated_at
 */
router.get('/:id', identity, async (ctx) => {
  await Chat.permissioned(ctx.identity.id, ctx.params.id);
  ctx.body = await Chat.get(ctx.params.id);
});

/**
 * @api {get} /chats Get all
 * @apiGroup Chat
 * @apiName Get all
 * @apiVersion 2.0.0
 * @apiDescription get chats
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiQuery {Number} page default 1
 * @apiQuery {Number{min: 1}} limit=10
 *
 * @apiSuccess (200) {Number} page
 * @apiSuccess (200) {Number} limit
 * @apiSuccess (200) {Number} total_count
 * @apiSuccess (200) {Object[]} items
 * @apiSuccess (200) {String} items.id
 * @apiSuccess (200) {String} items.name
 * @apiSuccess (200) {String} items.description
 * @apiSuccess (200) {String} items.type
 * @apiSuccess (200) {Datetime} items.created_at
 * @apiSuccess (200) {Datetime} items.updated_at
 */
router.get('/', identity, paginate, async (ctx) => {
  ctx.body = await Chat.all(ctx.identity.id, ctx.paginate);
});

/**
 * @api {post} /chats Find
 * @apiGroup Chat
 * @apiName Find by participants
 * @apiVersion 2.0.0
 * @apiDescription find chat(s) with the given set of participants
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiBody {String[]{min:1}} participants Mandatory identities id
 *
 * @apiSuccess (200) {Object[]} items
 * @apiSuccess (200) {String} items.id
 * @apiSuccess (200) {String} items.name
 * @apiSuccess (200) {String} items.description
 * @apiSuccess (200) {String} items.type
 * @apiSuccess (200) {Datetime} items.created_at
 * @apiSuccess (200) {Datetime} items.updated_at
 */
router.post('/find', identity, async (ctx) => {
  ctx.body = {items: await Chat.find(ctx.identity.id, ctx.request.body)};
});

/**
 * @api {post} /chats Create new
 * @apiGroup Chat
 * @apiName Create
 * @apiVersion 2.0.0
 * @apiDescription create new chat
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiBody {String} name Mandatory
 * @apiBody {String} description
 * @apiBody {String} type (CHAT, GROUP, CHANNEL)
 * @apiBody {String[]{min:1}} participants Mandatory identities id
 *
 * @apiSuccess (200) {String} id
 * @apiSuccess (200) {String} name
 * @apiSuccess (200) {String} description
 * @apiSuccess (200) {String} type
 * @apiSuccess (200) {Datetime} created_at
 * @apiSuccess (200) {Datetime} updated_at
 */
router.post('/', identity, async (ctx) => {
  ctx.body = await Chat.create(ctx.identity, ctx.request.body);
});

/**
 * @api {post} /chats/update/:id Update
 * @apiGroup Chat
 * @apiName Update
 * @apiVersion 2.0.0
 * @apiDescription update chat
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 * @apiParam {String} id
 *
 * @apiBody {String} name Mandatory
 * @apiBody {String} description
 * @apiBody {String} type (CHAT, GROUP, CHANNEL)
 * @apiBody {String[]{min:1 max:250}} participants Mandatory identities id
 *
 * @apiSuccess (200) {String} id
 * @apiSuccess (200) {String} name
 * @apiSuccess (200) {String} description
 * @apiSuccess (200) {String} type
 * @apiSuccess (200) {Datetime} created_at
 * @apiSuccess (200) {Datetime} updated_at
 */
router.post('/update/:id', identity, async (_ctx) => {
  throw new NotImplementedError();
  // await Chat.permissioned(
  //   ctx.identity.id,
  //   ctx.params.id,
  //   Chat.MemberTypes.ADMIN,
  // );
  // ctx.body = await Chat.update(ctx.params.id, ctx.request.body);
});

/**
 * @api {get} /chats/remove/:id Delete
 * @apiGroup Chat
 * @apiName Delete
 * @apiVersion 2.0.0
 * @apiDescription delete chat
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 * @apiParam {String} id
 *
 */
router.get('/remove/:id', identity, async (_ctx) => {
  throw new NotImplementedError();
  // await Chat.permissioned(
  //   ctx.identity.id,
  //   ctx.params.id,
  //   Chat.MemberTypes.ADMIN,
  // );
  // await Chat.delete(ctx.params.id);
  // ctx.body = {message: 'success'};
});

/**
 * @api {get} /chats/:id/participants Get participants
 * @apiGroup Chat
 * @apiName Get participants
 * @apiVersion 2.0.0
 * @apiDescription get chat participants
 *
 * @apiQuery {Number} page default 1
 * @apiQuery {Number{min: 1}} limit=10
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiParam {String} id
 *
 * @apiSuccess (200) {Number} page
 * @apiSuccess (200) {Number} limit
 * @apiSuccess (200) {Number} total_count
 * @apiSuccess (200) {Object[]} items
 * @apiSuccess (200) {String} items.id
 * @apiSuccess (200) {String} items.chat_id
 * @apiSuccess (200) {String} items.identity_id
 * @apiSuccess (200) {String} items.type (MEMBER, ADMIN)
 * @apiSuccess (200) {Datetime} items.muted_until
 * @apiSuccess (200) {String} identity_type
 * @apiSuccess (200) {Object} identity_meta
 * @apiSuccess (200) {Datetime} created_at
 * @apiSuccess (200) {Datetime} updated_at
 */

router.get('/:id/participants', paginate, identity, async (ctx) => {
  await Chat.permissioned(ctx.identity.id, ctx.params.id);
  ctx.body = await Chat.participants(ctx.params.id, ctx.paginate);
});

/**
 * @api {post} /chats/update/:id/participants/mute Mute participant
 * @apiGroup Chat
 * @apiName Mute participant
 * @apiVersion 2.0.0
 * @apiDescription mute participant
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiParam {String} id
 *
 * @apiBody {Datetime} until Mandatory
 */
router.post('/update/:id/participants/mute', identity, async (_ctx) => {
  throw new NotImplementedError();
  // await Chat.permissioned(ctx.identity.id, ctx.params.id);
  // await Chat.muteParticipant(
  //   ctx.params.id,
  //   ctx.identity.id,
  //   ctx.request.body.until,
  // );
  // ctx.body = {message: 'success'};
});

/**
 * @api {post} /chats/update/:id/participants/:identity_id/permit Permit participant
 * @apiGroup Chat
 * @apiName Permit participant
 * @apiVersion 2.0.0
 * @apiDescription permit participant
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiParam {String} id
 * @apiParam {String} identity_id
 *
 * @apiBody {String} type Mandatory (ADMIN, MEMBER)
 */
router.post('/update/:id/participants/:identity_id/permit', identity, async (_ctx) => {
  throw new NotImplementedError();
  // await Chat.permissioned(
  //   ctx.identity.id,
  //   ctx.params.id,
  //   Chat.MemberTypes.ADMIN,
  // );
  // ctx.body = await Chat.permitParticipant(
  //   ctx.params.id,
  //   ctx.params.identity_id,
  //   ctx.request.body.type,
  // );
});

/**
 * @api {post} /chats/update/:id/participants/:identity_id Add participant
 * @apiGroup Chat
 * @apiName Add participant
 * @apiVersion 2.0.0
 * @apiDescription add participant
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiParam {String} id
 * @apiParam {String} identity_id
 */
router.post('/update/:id/participants/:identity_id', identity, async (_ctx) => {
  throw new NotImplementedError();
  // await Chat.permissioned(
  //   ctx.identity.id,
  //   ctx.params.id,
  //   Chat.MemberTypes.ADMIN,
  // );
  // await Chat.addParticipant(
  //   ctx.params.id,
  //   ctx.params.identity_id,
  //   ctx.identity.id,
  // );

  // ctx.body = {message: 'success'};
});

/**
 * @api {get} /chats/remove/:id/participants/:identity_id remove participant
 * @apiGroup Chat
 * @apiName remove participant
 * @apiVersion 2.0.0
 * @apiDescription remove participant
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiParam {String} id
 * @apiParam {String} identity_id
 */
router.get('/remove/:id/participants/:identity_id', identity, async (_ctx) => {
  throw new NotImplementedError();
  // await Chat.permissioned(
  //   ctx.identity.id,
  //   ctx.params.id,
  //   Chat.MemberTypes.ADMIN,
  // );
  // await Chat.removeParticipant(
  //   ctx.params.id,
  //   ctx.params.identity_id,
  //   ctx.identity.id,
  // );
  // ctx.body = {message: 'success'};
});

/**
 * @api {get} /chats/:id/messages Messages
 * @apiGroup Chat
 * @apiName Messages
 * @apiVersion 2.0.0
 * @apiDescription messages
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiParam {String} id
 *
 * @apiQuery {Number} page default 1
 * @apiQuery {Number{min: 1}} limit=10
 *
 * @apiSuccess (200) {Number} page
 * @apiSuccess (200) {Number} limit
 * @apiSuccess (200) {Number} total_count
 * @apiSuccess (200) {Object[]} items
 * @apiSuccess (200) {String} items.id
 * @apiSuccess (200) {String} items.reply_id
 * @apiSuccess (200) {String} items.chat_id
 * @apiSuccess (200) {String} items.identity_id
 * @apiSuccess (200) {String} items.text
 * @apiSuccess (200) {Boolean} items.replied
 * @apiSuccess (200) {Datetime} items.read_at
 * @apiSuccess (200) {Datetime} items.created_at
 * @apiSuccess (200) {Datetime} items.updated_at
 *
 */
router.get('/:id/messages', identity, paginate, async (ctx) => {
  await Chat.permissioned(ctx.identity.id, ctx.params.id);
  ctx.body = await Chat.messages(ctx.params.id, ctx.paginate);
});

/**
 * @api {post} /chats/:id/messages New Messages
 * @apiGroup Chat
 * @apiName New Messages
 * @apiVersion 2.0.0
 * @apiDescription new messages
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiParam {String} id
 *
 * @apiBody {String} text
 *
 * @apiSuccess (200) {String} id
 * @apiSuccess (200) {String} reply_id
 * @apiSuccess (200) {String} chat_id
 * @apiSuccess (200) {String} identity_id
 * @apiSuccess (200) {String} text
 * @apiSuccess (200) {Boolean} replied
 * @apiSuccess (200) {Datetime} read_at
 * @apiSuccess (200) {Datetime} created_at
 * @apiSuccess (200) {Datetime} updated_at
 *
 */
router.post('/:id/messages', identity, async (ctx) => {
  await Chat.permissioned(ctx.identity.id, ctx.params.id);

  ctx.body = await Chat.newMessage(
    ctx.params.id,
    ctx.identity.id,
    ctx.request.body,
  );

  const participants = await Chat.miniParticipants(ctx.params.id);

  await Promise.all(
    participants.map((p) =>
      Event.push(Event.Types.CHAT, p.identity_id, {
        ...ctx.body,
        identity: ctx.identity,
        muted: p.muted_until
          ? p.muted_until.getTime() > new Date().getTime()
          : false,
      }),
    ),
  );
});

/**
 * @api {post} /chats/:id/messages/:message_id Reply Messages
 * @apiGroup Chat
 * @apiName Reply Messages
 * @apiVersion 2.0.0
 * @apiDescription reply messages
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiParam {String} id
 * @apiParam {String} message_id
 *
 * @apiBody {String} text
 * @apiBody {String} media media ref id
 *
 * @apiSuccess (200) {String} id
 * @apiSuccess (200) {String} reply_id
 * @apiSuccess (200) {String} chat_id
 * @apiSuccess (200) {String} identity_id
 * @apiSuccess (200) {String} text
 * @apiSuccess (200) {Boolean} replied
 * @apiSuccess (200) {Datetime} read_at
 * @apiSuccess (200) {Datetime} created_at
 * @apiSuccess (200) {Datetime} updated_at
 *
 */
router.post('/:id/messages/:message_id', identity, async (ctx) => {
  await Chat.permissioned(ctx.identity.id, ctx.params.id);
  ctx.body = await Chat.newMessage(
    ctx.params.id,
    ctx.identity.id,
    ctx.request.body,
    ctx.params.message_id,
  );

  const participants = await Chat.miniParticipants(ctx.params.id);

  await Promise.all(
    participants.map((p) =>
      Event.push(Event.Types.Chat, p.identity_id, {
        ...ctx.body,
        identity: ctx.identity,
        muted: p.muted_until
          ? p.muted_until.getTime() > new Date().getTime()
          : false,
      }),
    ),
  );
});

/**
 * @api {get} /chats/:id/messages/:message_id Get Reply Messages
 * @apiGroup Chat
 * @apiName Get Reply Messages
 * @apiVersion 2.0.0
 * @apiDescription reply messages
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiParam {String} id
 * @apiParam {String} message_id
 *
 * @apiQuery {Number} page default 1
 * @apiQuery {Number{min: 1}} limit=10
 *
 * @apiSuccess (200) {Number} page
 * @apiSuccess (200) {Number} limit
 * @apiSuccess (200) {Number} total_count
 * @apiSuccess (200) {Object[]} items
 * @apiSuccess (200) {String} items.id
 * @apiSuccess (200) {String} items.reply_id
 * @apiSuccess (200) {String} items.chat_id
 * @apiSuccess (200) {String} items.identity_id
 * @apiSuccess (200) {String} items.text
 * @apiSuccess (200) {Boolean} items.replied
 * @apiSuccess (200) {Datetime} items.read_at
 * @apiSuccess (200) {Datetime} items.created_at
 * @apiSuccess (200) {Datetime} items.updated_at
 *
 */
router.get('/:id/messages/:message_id', identity, paginate, async (ctx) => {
  await Chat.permissioned(ctx.identity.id, ctx.params.id);
  ctx.body = await Chat.messagesReplies(ctx.params.message_id, ctx.paginate);
});

/**
 * @api {post} /chats/update/:id/messages/:message_id Edit Messages
 * @apiGroup Chat
 * @apiName Edit Messages
 * @apiVersion 2.0.0
 * @apiDescription edit messages
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiParam {String} id
 * @apiParam {String} message_id
 *
 * @apiBody {String} text
 * @apiBody {String} media media ref id
 *
 * @apiSuccess (200) {String} id
 * @apiSuccess (200) {String} reply_id
 * @apiSuccess (200) {String} chat_id
 * @apiSuccess (200) {String} identity_id
 * @apiSuccess (200) {String} text
 * @apiSuccess (200) {Boolean} replied
 * @apiSuccess (200) {Datetime} read_at
 * @apiSuccess (200) {Datetime} created_at
 * @apiSuccess (200) {Datetime} updated_at
 *
 */
router.post('/update/:id/messages/:message_id', identity, async (ctx) => {
  await Chat.permissioned(ctx.identity.id, ctx.params.id);
  ctx.body = await Chat.editMessage(
    ctx.params.message_id,
    ctx.identity.id,
    ctx.request.body,
  );
});

/**
 * @api {post} /chats/update/:id/messages/:message_id/read read Messages
 * @apiGroup Chat
 * @apiName read Messages
 * @apiVersion 2.0.0
 * @apiDescription read messages
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiParam {String} id
 * @apiParam {String} message_id
 *
 *
 */
router.post('/update/:id/messages/:message_id/read', identity, async (ctx) => {
  await Chat.permissioned(ctx.identity.id, ctx.params.id);
  await Chat.readMessage(ctx.params.message_id, ctx.identity.id);
  ctx.body = {message: 'success'};
});

/**
 * @api {post} /chats/update/:id/messages/:message_id Delete messages
 * @apiGroup Chat
 * @apiName Delete Messages
 * @apiVersion 2.0.0
 * @apiDescription delete messages
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiParam {String} id
 * @apiParam {String} message_id
 *
 *
 */
router.get('/remove/:id/messages/:message_id', identity, async (ctx) => {
  await Chat.permissioned(ctx.identity.id, ctx.params.id);
  await Chat.removeMessage(ctx.params.message_id, ctx.identity.id);
  ctx.body = {message: 'success'};
});
