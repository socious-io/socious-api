import Data from '@socious/data';

export const makeMessage = (type, name) => {
  switch (type) {
    case Data.NotificationType.FOLLOWED:
      return {
        title: Data.NotificationTitle.FOLLOWED,
        body: `${name} followed you`,
      };

    case Data.NotificationType.CHAT:
      return {
        title: Data.NotificationTitle.CHAT,
        body: `${name} sent you a new message`,
      };

    case Data.NotificationType.COMMENT:
      return {
        title: Data.NotificationTitle.COMMENT,
        body: `${name} commented on your post`,
      };

    case Data.NotificationType.COMMENT_LIKE:
      return {
        title: Data.NotificationTitle.COMMENT_LIKE,
        body: `${name} liked your comment`,
      };

    case Data.NotificationType.POST_LIKE:
      return {
        title: Data.NotificationTitle.POST_LIKE,
        body: `${name} liked your post`,
      };

    case Data.NotificationType.SHARE_POST:
      return {
        title: Data.NotificationTitle.POST_LIKE,
        body: `${name} shared your post`,
      };

    case Data.NotificationType.APPLICATION:
      return {
        title: Data.NotificationTitle.APPLICATION,
        body: `${name} applied to your project`,
      };

    case Data.NotificationType.OFFER:
      return {
        title: Data.NotificationTitle.OFFER,
        body: `${name} sent you an offer`,
      };

    case Data.NotificationType.REJECT:
      return {
        title: Data.NotificationTitle.REJECT,
        body: `${name} rejected your application`,
      };

    case Data.NotificationType.APPROVED:
      return {
        title: Data.NotificationTitle.APPROVED,
        body: `${name} approved your offer`,
      };

    case Data.NotificationType.HIRED:
      return {
        title: Data.NotificationTitle.HIRED,
        body: `Congratulations, ${name} hired you`,
      };

    case Data.NotificationType.PROJECT_COMPLETE:
      return {
        title: Data.NotificationTitle.PROJECT_COMPLETE,
        body: `${name} completed the project`,
      };

    case Data.NotificationType.ASSIGNER_CONFIRMED:
      return {
        title: Data.NotificationTitle.ASSIGNER_CONFIRMED,
        body: `${name} confirmed your work submission`,
      };

    case Data.NotificationType.ASSIGNER_CANCELED:
      return {
        title: Data.NotificationTitle.ASSIGNER_CANCELED,
        body: `${name} removed you from the project`,
      };

    case Data.NotificationType.ASSIGNEE_CANCELED:
      return {
        title: Data.NotificationTitle.ASSIGNEE_CANCELED,
        body: `${name} left the project`,
      };

    case Data.NotificationType.MEMBERED:
      return {
        title: Data.NotificationTitle.MEMBERED,
        body: `${name} add you to the organization`,
      };

    case Data.NotificationType.CONNECT:
      return {
        title: Data.NotificationTitle.CONNECT,
        body: `${name} requested to connect with you`,
      };
    default:
      throw new Error(`${type} is not valid to create message`);
  }
};
