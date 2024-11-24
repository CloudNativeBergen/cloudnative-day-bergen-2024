import sgMail from '@sendgrid/mail'
import assert from 'assert'
import config from '@/../next.config'
import { formatDate } from '@/lib/time'
import { ProposalExisting, Action } from '@/lib/proposal/types'
import { Speaker } from '@/lib/speaker/types'

const { publicRuntimeConfig: c } = config

assert(process.env.SENDGRID_API_KEY, 'SENDGRID_API_KEY is not set')
assert(process.env.SENDGRID_FROM_EMAIL, 'SENDGRID_FROM_EMAIL is not set')
assert(
  process.env.SENDGRID_TEMPALTE_ID_CFP_ACCEPT,
  'SENDGRID_TEMPALTE_ID_CFP_ACCEPT is not set',
)
assert(
  process.env.SENDGRID_TEMPALTE_ID_CFP_REJECT,
  'SENDGRID_TEMPALTE_ID_CFP_REJECT is not set',
)

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)

const fromEmail = process.env.SENDGRID_FROM_EMAIL as string
const templateAccept = process.env.SENDGRID_TEMPALTE_ID_CFP_ACCEPT as string
const templateReject = process.env.SENDGRID_TEMPALTE_ID_CFP_REJECT as string

function getTemplate(action: Action) {
  switch (action) {
    case Action.accept:
      return templateAccept
    case Action.reject:
      return templateReject
    default:
      return ''
  }
}

export async function sendAcceptRejectNotification({
  action,
  speaker,
  proposal,
  comment = '',
}: {
  action: Action
  speaker: Speaker
  proposal: ProposalExisting
  comment: string
}): Promise<[sgMail.ClientResponse, object]> {
  const templateId = getTemplate(action)

  if (!templateId) {
    throw new Error(`Template not found for action: ${action}`)
  }

  const msg = {
    to: speaker.email,
    from: fromEmail,
    templateId: templateId,
    dynamicTemplateData: {
      speaker: {
        name: speaker.name,
      },
      proposal: {
        title: proposal.title,
        confirmUrl: `${process.env.NEXT_PUBLIC_URL}/cfp/list?confirm=${proposal._id}`,
        comment,
      },
      event: {
        location: c?.event.location,
        date: formatDate(c?.dates.conference),
        name: c?.event.name,
      },
    },
  }

  return await sgMail.send(msg)
}
