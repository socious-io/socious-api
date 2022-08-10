export const Types = {
  FOLLOWED: 'FOLLOWED',
  COMMENT_LIKE: 'COMMENT_LIKE',
  POST_LIKE: 'POST_LIKE',
  CHAT: 'CHAT',
  SHARE_POST: 'SHARE_POST',
  SHARE_PROJECT: 'SHARE_PROJECT',
  COMMENT: 'COMMENT',
  APPLICATION: 'APPLICATION',
};

// TODO: make this titles better
export const Title = {
  FOLLOWED: 'Followed',
  COMMENT_LIKE: 'Comment liked',
  POST_LIKE: 'Post liked',
  CHAT: 'New Message',
  SHARE_POST: 'Post shared',
  SHARE_PROJECT: 'Project shared',
  COMMENT: 'New commented',
  APPLICATION: 'Project applied',
};

// TODO: make this messages better
export const Messages = {
  FOLLOWED: 'followed',
  COMMENT_LIKE: 'comment liked',
  POST_LIKE: 'post liked',
  CHAT: 'chat',
  SHARE_POST: 'post shared',
  SHARE_PROJECT: 'project shared',
  COMMENT: 'commented',
  APPLICATION: 'applied',
};

export const Data = {
  FOLLOWED: {title: Title.FOLLOWED, body: Messages.FOLLOWED},
  COMMENT_LIKE: {title: Title.COMMENT_LIKE, body: Messages.COMMENT_LIKE},
  POST_LIKE: {title: Title.POST_LIKE, body: Messages.POST_LIKE},
  CHAT: {title: Title.CHAT, body: Messages.CHAT},
  SHARE_POST: {title: Title.SHARE_POST, body: Messages.SHARE_POST},
  SHARE_PROJECT: {title: Title.SHARE_PROJECT, body: Messages.SHARE_PROJECT},
  COMMENT: {title: Title.COMMENT, body: Messages.COMMENT},
  APPLICATION: {title: Title.APPLICATION, body: Messages.APPLICATION},
};
