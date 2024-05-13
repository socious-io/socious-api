import Data from '@socious/data'

export const makeMessage = (type, { name, job_name = undefined, org_name = undefined }) => {
  switch (type) {
    case Data.NotificationType.FOLLOWED:
      return {
        title: Data.NotificationTitle.FOLLOWED,
        body: `${name} followed you`
      }

    case Data.NotificationType.CHAT:
      return {
        title: Data.NotificationTitle.CHAT,
        body: `${name} sent you a new message`
      }

    case Data.NotificationType.COMMENT:
      return {
        title: Data.NotificationTitle.COMMENT,
        body: `${name} commented on your post`
      }

    case Data.NotificationType.COMMENT_LIKE:
      return {
        title: Data.NotificationTitle.COMMENT_LIKE,
        body: `${name} liked your comment`
      }

    case Data.NotificationType.POST_LIKE:
      return {
        title: Data.NotificationTitle.POST_LIKE,
        body: `${name} liked your post`
      }

    case Data.NotificationType.SHARE_POST:
      return {
        title: Data.NotificationTitle.POST_LIKE,
        body: `${name} shared your post`
      }

    case Data.NotificationType.APPLICATION:
      return {
        title: Data.NotificationTitle.APPLICATION,
        body: `${name} applied to your job`
      }

    case Data.NotificationType.OFFER:
      return {
        title: Data.NotificationTitle.OFFER,
        body: `${name} sent you an offer`
      }

    case Data.NotificationType.REJECT:
      return {
        title: 'Application update',
        body: `${name} updated your application`
      }

    case Data.NotificationType.APPROVED:
      return {
        title: Data.NotificationTitle.APPROVED,
        body: `${name} accepted your offer`
      }

    case Data.NotificationType.HIRED:
      return {
        title: Data.NotificationTitle.HIRED,
        body: `Congratulations, ${name} confirmed the start of your job!`
      }

    case Data.NotificationType.PROJECT_COMPLETE:
      return {
        title: Data.NotificationTitle.PROJECT_COMPLETE,
        body: `${name} submitted their work`
      }

    case Data.NotificationType.ASSIGNER_CONFIRMED:
      return {
        title: Data.NotificationTitle.ASSIGNER_CONFIRMED,
        body: `${name} confirmed your work submission`
      }

    case Data.NotificationType.ASSIGNER_CANCELED:
      return {
        title: Data.NotificationTitle.ASSIGNER_CANCELED,
        body: `${name} stopped the job. Accept or contest`
      }

    case Data.NotificationType.ASSIGNEE_CANCELED:
      return {
        title: Data.NotificationTitle.ASSIGNEE_CANCELED,
        body: `${name} stopped the job.`
      }

    case Data.NotificationType.MEMBERED:
      return {
        title: Data.NotificationTitle.MEMBERED,
        body: `${name} added you as a member`
      }

    case Data.NotificationType.CONNECT:
      return {
        title: Data.NotificationTitle.CONNECT,
        body: `${name} requested to connect with you`
      }
    case Data.NotificationType.ACCEPT_CONNECT:
      return {
        title: Data.NotificationTitle.ACCEPT_CONNECT,
        body: `${name} accepted your connection request. You can now message each other.`
      }
    case Data.NotificationType.REFERRAL_JOINED:
      return {
        title: 'referral joined',
        body: `${name} has joined Socious via your invitation`
      }
    case Data.NotificationType.REFERRAL_VERIFIED:
      return {
        title: 'referral verified',
        body: `${name} has verified their profile. You will earn now 1% of their earnings.`
      }
    case Data.NotificationType.REFERRAL_HIRED:
      return {
        title: 'referral hired',
        body: `${name} has been hired by ${org_name} as ${job_name}`
      }
    case Data.NotificationType.REFERRAL_COMPLETED_JOB:
      return {
        title: 'referral completed job',
        body: `${name} successfully completed their job as ${job_name}`
      }
    case Data.NotificationType.REFERRAL_CONFIRMED_JOB:
      return {
        title: 'referral confirmed job',
        body: `${name} has been confirmed job`
      }
    case Data.NotificationType.EXPERIENCE_VERIFY_REQUEST:
      return {
        title: 'request experience verify',
        body: `${name} sent you a request to receive a digital certificate from your organization`
      }
    case Data.NotificationType.EXPERIENCE_VERIFY_APPROVED:
      return {
        title: 'experience verfied',
        body: `${org_name} has approved your request and issued you a digital certificate. Claim now`
      }
    case Data.NotificationType.EXPERIENCE_VERIFY_REJECTED:
      return {
        title: 'experience rejected',
        body: `${name} has been rejected your experience`
      }
    case Data.NotificationType.EXPERIENCE_ISSUED:
      return {
        title: 'issued experience',
        body: `${name} issued work experience for you`
      }
    case Data.NotificationType.EXPERIENCE_ISSUED_APPROVED:
      return {
        title: 'issued experience accepted',
        body: `${name} has accepted your credential`
      }
    case Data.NotificationType.EXPERIENCE_ISSUED_REJECTED:
      return {
        title: 'issued experience rejected',
        body: `${name} rejected your work experience issue`
      }
    case Data.NotificationType.EDUCATION_VERIFY_REQUEST:
      return {
        title: 'request education verify',
        body: `${name} sent a request for a digital certificate confirming her education at your organization`
      }
    case Data.NotificationType.EDUCATION_VERIFY_APPROVED:
      return {
        title: 'education verfied',
        body: `${name} Has approved your request and issued you a digital certificate. Claim now.`
      }
    case Data.NotificationType.EDUCATION_VERIFY_REJECTED:
      return {
        title: 'education rejected',
        body: `${name} has been rejected your education`
      }
    case Data.NotificationType.EDUCATION_ISSUED:
      return {
        title: 'issued education',
        body: `${name} issued education certificate for you`
      }
    case Data.NotificationType.EDUCATION_ISSUED_APPROVED:
      return {
        title: 'issued experience accepted',
        body: `${name} has accepted your credential`
      }
    case Data.NotificationType.EDUCATION_ISSUED_REJECTED:
      return {
        title: 'issued experience rejected',
        body: `${name} rejected issued education certificate`
      }
    default:
      throw new Error(`${type} is not valid to create message`)
  }
}
