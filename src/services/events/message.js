import Notif from '../../models/notification/index.js';

export const makeMessage = (type, body) => {
  const name = body.identity?.meta?.username || body.identity?.meta?.shortname;
  switch (type) {
    case Notif.Types.FOLLOWED:
      return {title: Notif.Title.FOLLOWED, body: `${name} followed you`};

    case Notif.Types.CHAT:
      return {title: Notif.Title.CHAT, body: `${name} sent you new message`};

    case Notif.Types.COMMENT:
      return {
        title: Notif.Title.COMMENT,
        body: `${name} has comment on your post`,
      };

    case Notif.Types.COMMENT_LIKE:
      return {
        title: Notif.Title.COMMENT_LIKE,
        body: `${name} liked your comment`,
      };

    case Notif.Types.POST_LIKE:
      return {title: Notif.Title.POST_LIKE, body: `${name} liked your post`};

    case Notif.Types.SHARE_POST:
      return {title: Notif.Title.POST_LIKE, body: `${name} shared your post`};

    case Notif.Types.APPLICATION:
      return {
        title: Notif.Title.POST_LIKE,
        body: `${name} applied to your project`,
      };

    default:
      throw new Error(`${type} is not valid to create message`);
  }
};
