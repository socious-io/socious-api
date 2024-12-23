import Router from '@koa/router'
import { validate } from '@socious/data'
import Post from '../models/post/index.js'
import Notif from '../models/notification/index.js'
import Event from '../services/events/index.js'
import { paginate } from '../utils/middlewares/requests.js'
import { loginOptional, loginRequired } from '../utils/middlewares/authorization.js'
import { checkIdParams } from '../utils/middlewares/route.js'
import { discordfeedReportMessenger } from '../utils/externals.js'
export const router = new Router()

router.get('/:id', loginOptional, checkIdParams, async (ctx) => {
  ctx.body = await Post.get(ctx.params.id, ctx.identity.id)
})

router.get('/', loginOptional, paginate, async (ctx) => {
  ctx.body = await Post.all(ctx.identity.id, ctx.paginate)
})

router.post('/', loginRequired, async (ctx) => {
  await validate.PostSchema.validateAsync(ctx.request.body)
  ctx.body = await Post.insert(ctx.identity.id, ctx.request.body)
})

router.post('/:id/report', loginRequired, async (ctx) => {
  await validate.ReportSchema.validateAsync(ctx.request.body)
  const reportId = await Post.report({
    ...ctx.request.body,
    post_id: ctx.params.id,
    identity_id: ctx.identity.id
  })

  //Reporting on Discord
  const report = await Post.getPostReport(reportId)
  await discordfeedReportMessenger.sendWithTitleAndProperties({
    title: `:no_entry_sign: Post '${report.post.title}' has been reported`,
    detailObject: {
      'Post ID': report.post?.id,
      'Post Title': report.post?.title,
      'Post Content': report.post?.content,
      'Reporter ID': report.identity_meta.id,
      'Reporter Name': report.identity_meta.name,
      'Reporter Email': report.identity_meta.email,
    }
  })

  ctx.body = {
    message: 'success'
  }
})

router.post('/update/:id', loginRequired, checkIdParams, async (ctx) => {
  await validate.PostSchema.validateAsync(ctx.request.body)
  await Post.permissioned(ctx.identity.id, ctx.params.id)
  ctx.body = await Post.update(ctx.params.id, ctx.identity.id, ctx.request.body)
})

router.post('/remove/:id', loginRequired, checkIdParams, async (ctx) => {
  await Post.permissioned(ctx.identity.id, ctx.params.id)
  await Post.remove(ctx.params.id)
  ctx.body = {
    message: 'success'
  }
})

router.get('/:id/comments', loginOptional, paginate, checkIdParams, async (ctx) => {
  ctx.body = await Post.comments(ctx.params.id, ctx.identity.id, ctx.paginate)
})

router.get('/comments/:id', loginOptional, paginate, checkIdParams, async (ctx) => {
  ctx.body = await Post.commentsReplies(ctx.params.id, ctx.identity.id, ctx.paginate)
})

router.post('/remove/comments/:id', loginRequired, checkIdParams, async (ctx) => {
  await validate.UUID.validateAsync(ctx.params.id)
  await Post.removeComment(ctx.params.id, ctx.identity.id)
  ctx.body = {
    message: 'success'
  }
})

router.post('/:id/comments', loginRequired, checkIdParams, async (ctx) => {
  await validate.CommentSchema.validateAsync(ctx.request.body)

  const comment = await Post.newComment(ctx.params.id, ctx.identity.id, ctx.request.body)
  ctx.body = await Post.getComment(comment.id, ctx.identity.id)

  const post = await Post.miniGet(ctx.params.id)

  Event.push(Event.Types.NOTIFICATION, post.identity_id, {
    type: Notif.Types.COMMENT,
    refId: ctx.body.id,
    parentId: post.id,
    identity: ctx.identity
  })
})

router.post('/comments/:id/report', loginRequired, async (ctx) => {
  await validate.ReportSchema.validateAsync(ctx.request.body)
  const reportId = await Post.reportComment({
    ...ctx.request.body,
    comment_id: ctx.params.id,
    identity_id: ctx.identity.id
  })

  //Reporting on Discord
  const report = await Post.getCommentReport(reportId)
  await discordfeedReportMessenger.sendWithTitleAndProperties({
    title: `:no_entry_sign: Comment on Post: '${report.post.title}' has been reported`,
    detailObject: {
      'Post ID': report.post?.id,
      'Post Title': report.post?.title,
      'Post Content': report.post?.content,
      'Comment ID': report.comment?.id,
      'Comment Content': report.comment?.content,
      'Reporter ID': report.identity_meta.id,
      'Reporter Name': report.identity_meta.name,
      'Reporter Email': report.identity_meta.email,
    }
  })

  ctx.body = {
    message: 'success'
  }
})

router.post('/update/comments/:id', loginRequired, checkIdParams, async (ctx) => {
  await validate.CommentSchema.validateAsync(ctx.request.body)
  await Post.updateComment(ctx.params.id, ctx.identity.id, ctx.request.body)
  ctx.body = await Post.getComment(ctx.params.id, ctx.identity.id)
})

router.post('/:id/like', loginRequired, checkIdParams, async (ctx) => {
  ctx.body = await Post.like(ctx.params.id, ctx.identity.id)

  const post = await Post.miniGet(ctx.params.id)

  Event.push(Event.Types.NOTIFICATION, post.identity_id, {
    type: Notif.Types.POST_LIKE,
    refId: ctx.body.id,
    parentId: post.id,
    identity: ctx.identity
  })
})

router.post('/:id/react', loginRequired, checkIdParams, async (ctx) => {
  ctx.body = await Post.react(ctx.identity.id, ctx.request.body.emoji, ctx.params.id)
})

router.post('/:id/unreact', loginRequired, checkIdParams, async (ctx) => {
  await Post.unreact(ctx.identity.id, ctx.request.body.emoji, ctx.params.id)
  ctx.body = ctx.body = {
    message: 'success'
  }
})

router.post('/:id/unlike', loginRequired, checkIdParams, async (ctx) => {
  await Post.unlike(ctx.params.id, ctx.identity.id)
  ctx.body = {
    message: 'success'
  }
})

router.post('/:id/comments/:comment_id/like', loginRequired, checkIdParams, async (ctx) => {
  ctx.body = await Post.like(ctx.params.id, ctx.identity.id, ctx.params.comment_id)

  const comment = await Post.getCommentMini(ctx.params.comment_id)

  Event.push(Event.Types.NOTIFICATION, comment.identity_id, {
    type: Notif.Types.COMMENT_LIKE,
    refId: ctx.body.id,
    parentId: comment.post_id,
    identity: ctx.identity
  })
})

router.post('/:id/comments/:comment_id/unlike', loginRequired, checkIdParams, async (ctx) => {
  await Post.unlike(ctx.params.id, ctx.identity.id, ctx.params.comment_id)
  ctx.body = {
    message: 'success'
  }
})

router.post('/:id/comments/:comment_id/react', loginRequired, checkIdParams, async (ctx) => {
  ctx.body = await Post.react(ctx.identity.id, ctx.request.body.emoji, ctx.params.id, ctx.params.comment_id)
})

router.post('/:id/comments/:comment_id/unreact', loginRequired, checkIdParams, async (ctx) => {
  await Post.unreact(ctx.identity.id, ctx.request.body.emoji, ctx.params.id, ctx.params.comment_id)
  ctx.body = {
    message: 'success'
  }
})

router.post('/:id/share', loginRequired, checkIdParams, async (ctx) => {
  ctx.body = await Post.share(ctx.params.id, ctx.identity.id, ctx.request.body)
})
