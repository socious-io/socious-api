import Data from '@socious/data'

export const makeMessage = (type, name) => {
  switch (type) {
    case Data.NotificationType.FOLLOWED:
      return {title: Data.NotificationTitle.FOLLOWED, body: `${name} followed you`};

    case Data.NotificationType.CHAT:
      return {title: Data.NotificationTitle.CHAT, body: `${name} sent you new message`};

    case Data.NotificationType.COMMENT:
      return {
        title: Data.NotificationTitle.COMMENT,
        body: `${name} has comment on your post`,
      };

    case Data.NotificationType.COMMENT_LIKE:
      return {
        title: Data.NotificationTitle.COMMENT_LIKE,
        body: `${name} liked your comment`,
      };

    case Data.NotificationType.POST_LIKE:
      return {title: Data.NotificationTitle.POST_LIKE, body: `${name} liked your post`};

    case Data.NotificationType.SHARE_POST:
      return {title: Data.NotificationTitle.POST_LIKE, body: `${name} shared your post`};

    case Data.NotificationType.APPLICATION:
      return {
        title: Data.NotificationTitle.POST_LIKE,
        body: `${name} applied to your project`,
      };

    default:
      throw new Error(`${type} is not valid to create message`);
  }
};
