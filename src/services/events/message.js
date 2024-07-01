import Data from '@socious/data'

export const makeMessage = (type, { name, job_name = undefined, org_name = undefined, dispute = undefined }) => {
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
        body: `${name} has approved your request and issued you a digital certificate. Claim now`
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
    case Data.NotificationType.DISPUTE_INITIATED:
      return {
        title: `"${dispute.title}" (Dispute ID #${dispute.code}). Review the dispute details and submit your response before ${dispute.expiration}.`,
        body: `${name} Submitted a dispute against you:`
      }
    case Data.NotificationType.DISPUTE_NEW_MESSAGE:
      return {
        title: ``,
        body: ``
      }
    case Data.NotificationType.DISPUTE_NEW_RESPONSE:
      return {
        title: `"${dispute.title}" (Dispute ID #${dispute.code}). Review their response and evidence in the disputes section.`,
        body: `${name} Has submitted their response to your dispute:`
      }
    case Data.NotificationType.DISPUTE_WITHDRAWN:
      return {
        title: ``,
        body: ``
      }
    case Data.NotificationType.DISPUTE_JUROR_CONTRIBUTION_INVITED:
      return {
        title: `Dispute ID #${dispute.code} - Response required within 72 Hours
        
        You have been invited to serve as a juror for a dispute on Socious. Accept the invitation to earn impact points and contribute to a fair resolution. Click to review the details and accept or decline.`,
        body: `Socious Team Juror Invitation: `
      }
    //TODO: Goes to jurors only -> DISPUTE_JUROR_SELECTION_COMPLETED
    case Data.NotificationType.DISPUTE_JUROR_SELECTION_COMPLETED_TO_JURORS: //TODO: add this
      return {
        title: `Dispute ID #${dispute.code} - Jury selection complete
        
        The jury selection process is now complete, you will be collaborating with two other jurors to review the case materials and reach a fair decision`,
        body: `Socious Team`
      }
    case Data.NotificationType.DISPUTE_JUROR_SELECTION_COMPLETED_TO_PARTIES: //TODO: add this
      return {
        title: `Dispute ID #${dispute.code}
        3 jurors have been selected. They have until ${dispute.expiration} to reach a decision.`,
        body: `Socious Team`
      }
    case Data.NotificationType.DISPUTE_CLOSED_TO_LOSER_PARTY: //TODO: add this
      return {
        title: `The jurors have reached a decision on the dispute (Dispute ID #${dispute.code}) filed against you. View the outcome in the disputes section.`,
        body: `Socious Team`
      }
    default:
      throw new Error(`${type} is not valid to create message`)
  }
}
