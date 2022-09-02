import Router from '@koa/router';
import Post from '../models/post/index.js';
import {paginate, identity} from '../utils/requests.js';
export const router = new Router();

/**
 * @api {get} /posts/:id Get
 * @apiGroup Post
 * @apiName Get
 * @apiVersion 2.0.0
 * @apiDescription get post
 *
 * @apiParam {String} id
 *
 * @apiSuccess (200) {String} id
 * @apiSuccess (200) {String} content
 * @apiSuccess (200) {Datetime} created_at
 * @apiSuccess (200) {Datetime} updated_at
 * @apiSuccess (200) {Number} likes liked count
 * @apiSuccess (200) {Boolean} liked current user liked
 * @apiSuccess (200) {String} identity_id
 * @apiSuccess (200) {String} identity_type
 * @apiSuccess (200) {Object} identity_meta
 * @apiSuccess (200) {String[]} media
 * @apiSuccess (200) {String[]} hashtags
 * @apiSuccess (200) {String[]} causes_tags
 * @apiSuccess (200) {String[]} identity_tags
 */
router.get('/:id', identity, async (ctx) => {
  ctx.body = await Post.get(ctx.params.id, ctx.identity.id);
});

/**
 * @api {get} /posts Get all
 * @apiGroup Post
 * @apiName Get all
 * @apiVersion 2.0.0
 * @apiDescription get posts
 *
 * @apiQuery {Number} page default 1
 * @apiQuery {Number{min: 1}} limit=10
 *
 * @apiQuery {String} identity filter by identity posted
 *
 * @apiSuccess (200) {Number} page
 * @apiSuccess (200) {Number} limit
 * @apiSuccess (200) {Number} total_count
 * @apiSuccess (200) {Object[]} items
 * @apiSuccess (200) {String} items.id
 * @apiSuccess (200) {Number} items.likes liked count
 * @apiSuccess (200) {Boolean} items.liked current user liked
 * @apiSuccess (200) {String} items.content
 * @apiSuccess (200) {Datetime} items.created_at
 * @apiSuccess (200) {Datetime} items.updated_at
 * @apiSuccess (200) {String} items.identity_id
 * @apiSuccess (200) {String} items.identity_type
 * @apiSuccess (200) {Object} items.identity_meta
 * @apiSuccess (200) {String[]} items.media
 * @apiSuccess (200) {String[]} items.hashtags
 * @apiSuccess (200) {String[]} items.causes_tags
 * @apiSuccess (200) {String[]} items.identity_tags
 */
router.get('/', paginate, identity, async (ctx) => {
  ctx.body = ctx.query.identity
    ? await Post.allByIdentity(
        ctx.identity.id,
        ctx.query.identity,
        ctx.paginate,
      )
    : await Post.all(ctx.identity.id, ctx.paginate);
});

/**
 * @api {post} /posts Create new
 * @apiGroup Post
 * @apiName Create
 * @apiVersion 2.0.0
 * @apiDescription create new post
 *
 * @apiBody {String} content
 * @apiBody {String[]} media
 * @apiBody {String[]} hashtags
 * @apiBody {String[]} causes_tags
 * @apiBody {String[]} identity_tags
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 *
 * @apiSuccess (200) {String} id
 * @apiSuccess (200) {String} content
 * @apiSuccess (200) {String[]} media
 * @apiSuccess (200) {String[]} hashtags
 * @apiSuccess (200) {String[]} causes_tags
 * @apiSuccess (200) {String[]} identity_tags
 * @apiSuccess (200) {Datetime} created_at
 * @apiSuccess (200) {Datetime} updated_at
 * @apiSuccess (200) {String} identity_id
 */
router.post('/', identity, async (ctx) => {
  ctx.body = await Post.insert(ctx.identity.id, ctx.request.body);
});

/**
 * @api {put} /posts/:id Update
 * @apiGroup Post
 * @apiName Update
 * @apiVersion 2.0.0
 * @apiDescription update post
 *
 * @apiBody {String} content
 * @apiBody {String[]} hashtags
 * @apiBody {String[]} media
 * @apiBody {String[]} causes_tags
 * @apiBody {String[]} identity_tags
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiParam {String} id
 *
 * @apiSuccess (200) {String} id
 * @apiSuccess (200) {String} content
 * @apiSuccess (200) {String[]} hashtags
 * @apiSuccess (200) {String[]} causes_tags
 * @apiSuccess (200) {String[]} identity_tags
 * @apiSuccess (200) {String[]} media
 * @apiSuccess (200) {Datetime} created_at
 * @apiSuccess (200) {Datetime} updated_at
 * @apiSuccess (200) {String} identity_id
 */
router.put('/:id', identity, async (ctx) => {
  await Post.permissioned(ctx.identity.id, ctx.params.id);
  ctx.body = await Post.update(ctx.params.id, ctx.request.body);
});

/**
 * @api {delete} /posts/:id Delete
 * @apiGroup Post
 * @apiName Delete
 * @apiVersion 2.0.0
 * @apiDescription delete post
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiParam {String} id
 *
 * @apiSuccess (200) {Object} success
 */
router.delete('/:id', identity, async (ctx) => {
  await Post.permissioned(ctx.identity.id, ctx.params.id);
  await Post.remove(ctx.params.id);
  ctx.body = {message: 'success'};
});

/**
 * @api {get} /posts/:id/comments Comments
 * @apiGroup Post.Comment
 * @apiName Comments
 * @apiVersion 2.0.0
 * @apiDescription comments
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiParam {String} id post id
 *
 * @apiQuery {Number} page default 1
 * @apiQuery {Number{min: 1}} limit=10
 *
 *
 * @apiSuccess (200) {Number} page
 * @apiSuccess (200) {Number} limit
 * @apiSuccess (200) {Number} total_count
 * @apiSuccess (200) {Object[]} items
 * @apiSuccess (200) {String} id
 * @apiSuccess (200) {String} content
 * @apiSuccess (200) {String} reply_id
 * @apiSuccess (200) {Boolean} replied
 * @apiSuccess (200) {String} identity_id
 * @apiSuccess (200) {String} identity_type
 * @apiSuccess (200) {Object} identity_meta
 *
 */
router.get('/:id/comments', paginate, identity, async (ctx) => {
  ctx.body = await Post.comments(ctx.params.id, ctx.identity.id, ctx.paginate);
});

/**
 * @api {post} /posts/comments/:id Replied Comments
 * @apiGroup Post.Comment
 * @apiName RepliedComments
 * @apiVersion 2.0.0
 * @apiDescription comments
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiParam {String} id comment id
 *
 * @apiQuery {Number} page default 1
 * @apiQuery {Number{min: 1}} limit=10
 *
 *
 * @apiSuccess (200) {Number} page
 * @apiSuccess (200) {Number} limit
 * @apiSuccess (200) {Number} total_count
 * @apiSuccess (200) {Object[]} items
 * @apiSuccess (200) {String} id
 * @apiSuccess (200) {String} content
 * @apiSuccess (200) {String} reply_id
 * @apiSuccess (200) {Boolean} replied
 * @apiSuccess (200) {String} identity_id
 * @apiSuccess (200) {String} identity_type
 * @apiSuccess (200) {Object} identity_meta
 *
 */
router.get('/comments/:id', paginate, identity, async (ctx) => {
  ctx.body = await Post.commentsReplies(
    ctx.params.id,
    ctx.identity.id,
    ctx.paginate,
  );
});

/**
 * @api {delete} /posts/comments/:id Delete
 * @apiGroup Post.Comment
 * @apiName Delete
 * @apiVersion 2.0.0
 * @apiDescription delete comment
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiParam {String} id comment
 *
 * @apiSuccess (200) {Object} success
 */
router.delete('/comments/:id', identity, async (ctx) => {
  await Post.removeComment(ctx.params.id, ctx.identity.id);
  ctx.body = {message: 'success'};
});

/**
 * @api {post} /posts/:id/comments New Comment
 * @apiGroup Post.Comment
 * @apiName NewComment
 * @apiVersion 2.0.0
 * @apiDescription new comment
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiParam {String} id post id
 *
 * @apiBody {String} content
 * @apiBody {String} reply_id comment replied id
 *
 * @apiSuccess (200) {String} id
 * @apiSuccess (200) {String} content
 * @apiSuccess (200) {String} reply_id
 * @apiSuccess (200) {Boolean} replied
 * @apiSuccess (200) {String} identity_id
 * @apiSuccess (200) {String} identity_type
 * @apiSuccess (200) {Object} identity_meta
 *
 */
router.post('/:id/comments', identity, async (ctx) => {
  ctx.body = await Post.newComment(
    ctx.params.id,
    ctx.identity.id,
    ctx.request.body,
  );
});

/**
 * @api {put} /posts/comments/:id Update Comment
 * @apiGroup Post.Comment
 * @apiName UpdateComment
 * @apiVersion 2.0.0
 * @apiDescription update comment
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiParam {String} id comment id
 *
 * @apiBody {String} content
 *
 * @apiSuccess (200) {String} id
 * @apiSuccess (200) {String} content
 * @apiSuccess (200) {String} reply_id
 * @apiSuccess (200) {Boolean} replied
 * @apiSuccess (200) {String} identity_id
 * @apiSuccess (200) {String} identity_type
 * @apiSuccess (200) {Object} identity_meta
 *
 */
router.put('/comments/:id', identity, async (ctx) => {
  ctx.body = await Post.updateComment(
    ctx.params.id,
    ctx.identity.id,
    ctx.request.body,
  );
});

/**
 * @api {put} /posts/:id/like Like Post
 * @apiGroup Post
 * @apiName LikePost
 * @apiVersion 2.0.0
 * @apiDescription like a post
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiParam {String} id post id
 *
 *
 */
router.put('/:id/like', identity, async (ctx) => {
  ctx.body = await Post.like(ctx.params.id, ctx.identity.id);
});

/**
 * @api {delete} /posts/:id/like UnLike Post
 * @apiGroup Post
 * @apiName UnLikePost
 * @apiVersion 2.0.0
 * @apiDescription unlike liked post
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiParam {String} id post id
 *
 *
 *
 */
router.delete('/:id/like', identity, async (ctx) => {
  await Post.unlike(ctx.params.id, ctx.identity.id);
  ctx.body = {message: 'success'};
});

/**
 * @api {put} /posts/:id/comments/:comment_id/like Like Comment
 * @apiGroup Post.Comment
 * @apiName LikeComment
 * @apiVersion 2.0.0
 * @apiDescription like a comment
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiParam {String} id post id
 * @apiParam {String} comment_id comment id
 *
 *
 */
router.put('/:id/comments/:comment_id/like', identity, async (ctx) => {
  ctx.body = await Post.like(
    ctx.params.id,
    ctx.identity.id,
    ctx.params.comment_id,
  );
});

/**
 * @api {delete} /posts/:id/comments/:comment_id/like UnLike Comment
 * @apiGroup Post.Comment
 * @apiName UnLikeComment
 * @apiVersion 2.0.0
 * @apiDescription unlike liked post
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiParam {String} id post id
 * @apiParam {String} comment_id comment id
 *
 *
 *
 */
router.delete('/:id/comments/:comment_id/like', identity, async (ctx) => {
  await Post.unlike(ctx.params.id, ctx.identity.id, ctx.params.comment_id);
  ctx.body = {message: 'success'};
});

/**
 * @api {post} /posts/:id/share Share
 * @apiGroup Post
 * @apiName Share
 * @apiVersion 2.0.0
 * @apiDescription like a post
 *
 * @apiHeader {String} Current-Identity default current user identity can set organization identity if current user has permission
 *
 * @apiParam {String} id post id
 *
 * @apiBody {String} content
 *
 */
router.post('/:id/share', identity, async (ctx) => {
  ctx.body = await Post.share(ctx.params.id, ctx.identity.id, ctx.request.body);
});
