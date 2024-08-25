'use client'

import { BackgroundImage } from '@/components/BackgroundImage'
import { Container } from '@/components/Container'
import { Layout } from '@/components/Layout'
import { ProposalExisting, Status, Action } from '@/lib/proposal/types'
import { useState, useEffect } from 'react'
import { listProposals } from '@/lib/proposal/client'
import { useSearchParams } from 'next/navigation'
import { FormatStatus } from '@/lib/proposal/format'
import {
  CheckCircleIcon,
  XMarkIcon,
  PlusCircleIcon,
  EnvelopeIcon,
  BookOpenIcon,
  PencilIcon,
  UserCircleIcon,
} from '@heroicons/react/20/solid'
import { SpinnerIcon } from '@/components/SocialIcons'
import { ProposalActionModal } from '@/components/ProposalActionModal'
import config from '@/../next.config'

const { publicRuntimeConfig: c } = config

interface ButtonAction {
  label: Action
  icon: any
  link?: string
  onClick?: () => void
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function ActionLink({ action }: { action: ButtonAction }) {
  return (
    <a
      href={action.link}
      className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 border border-transparent py-4 text-sm font-semibold text-gray-900"
    >
      <action.icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      {capitalizeFirstLetter(action.label)}
    </a>
  )
}

function ActionButton({
  action,
  isLoading,
}: {
  action: ButtonAction
  isLoading: boolean
}) {
  return (
    <button
      disabled={isLoading}
      onClick={action.onClick}
      className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 border border-transparent py-4 text-sm font-semibold text-gray-900"
    >
      {isLoading ? (
        <SpinnerIcon className="text-grey-400 h-5 w-5 animate-spin" />
      ) : (
        <action.icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      )}
      {capitalizeFirstLetter(action.label)}
    </button>
  )
}

function ProposalCards({
  proposals,
  action,
}: {
  proposals: ProposalExisting[]
  action: (proposal: ProposalExisting, action: Action) => void
}) {
  return (
    <ul
      role="list"
      className="mx-auto mt-6 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 lg:max-w-4xl"
    >
      {proposals.map((proposal) => {
        const actions: ButtonAction[] = []

        if (
          proposal.status === Status.draft ||
          proposal.status === Status.submitted
        ) {
          actions.push({
            label: Action.edit,
            icon: PencilIcon,
            link: `/cfp/submit?id=${proposal._id}`,
          })
        } else {
          actions.push({
            label: Action.view,
            icon: BookOpenIcon,
            link: `/cfp/submit?id=${proposal._id}`,
          })
        }

        if (proposal.status === Status.draft) {
          actions.push({
            label: Action.submit,
            icon: EnvelopeIcon,
            onClick: async () => {
              action(proposal, Action.submit)
            },
          })
        }

        if (proposal.status === Status.submitted) {
          actions.push({
            label: Action.unsubmit,
            icon: XMarkIcon,
            onClick: () => {
              action(proposal, Action.unsubmit)
            },
          })
        }

        if (
          proposal.status === Status.confirmed ||
          proposal.status === Status.accepted
        ) {
          actions.push({
            label: Action.withdraw,
            icon: XMarkIcon,
            onClick: () => {
              action(proposal, Action.withdraw)
            },
          })
        }

        if (proposal.status === Status.accepted) {
          actions.push({
            label: Action.confirm,
            icon: CheckCircleIcon,
            onClick: () => {
              action(proposal, Action.confirm)
            },
          })
        }

        return (
          <li
            key={proposal._id}
            className={classNames(
              proposal.status === Status.accepted
                ? 'border-2 border-green-500/50'
                : '',
              'col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow',
            )}
          >
            <div className="flex w-full items-center justify-between space-x-6 p-6">
              <div className="flex-1 truncate">
                <div className="flex items-center space-x-3">
                  <h3 className="truncate text-sm font-medium text-gray-900">
                    {proposal.title}
                  </h3>
                  <FormatStatus status={proposal.status} />
                </div>
                <p className="mt-1 truncate text-sm text-gray-500">
                  {proposal.status === Status.accepted ? (
                    <>Your proposal has been accepted.</>
                  ) : (
                    <>{proposal.description}</>
                  )}
                </p>
              </div>
              {proposal.speaker && 'image' in proposal.speaker ? (
                <img
                  className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"
                  src={proposal.speaker.image}
                  alt=""
                />
              ) : (
                <UserCircleIcon
                  className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"
                  aria-hidden="true"
                />
              )}
            </div>
            {actions.length > 0 && (
              <div>
                <div className="-mt-px flex divide-x divide-gray-200">
                  {actions.map((action, i) => (
                    <div
                      key={`${proposal._id}-${action.label}`}
                      className={classNames(
                        i > 0 ? '-ml-px' : '',
                        'relative flex inline-flex w-0 flex-1',
                      )}
                    >
                      {action.link ? (
                        <ActionLink action={action} />
                      ) : (
                        <ActionButton action={action} isLoading={false} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

function Success() {
  const [showMessage, setShowMessage] = useState(true)

  const dismissMessage = () => {
    window.history.replaceState({}, document.title, window.location.pathname)
    setShowMessage(false)
  }

  return (
    <>
      {showMessage && (
        <div className="mx-auto mt-6 flex max-w-2xl flex-col rounded-md bg-green-50 p-4 lg:max-w-4xl lg:px-12">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircleIcon
                className="h-5 w-5 text-green-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Proposal submitted successfully.
              </p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  type="button"
                  className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                  onClick={dismissMessage}
                >
                  <span className="sr-only">Dismiss</span>
                  <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default function MyProposals() {
  const searchParams = useSearchParams()
  const success = searchParams.get('success') ?? undefined
  const confirm = searchParams.get('confirm') ?? ''

  const [actionOpen, setActionOpen] = useState<boolean>(false)
  const [actionProposal, setActionProposal] = useState<ProposalExisting>(
    {} as ProposalExisting,
  )
  const [actionAction, setActionAction] = useState<Action>(Action.submit)

  const [proposals, setProposals] = useState<ProposalExisting[]>([])
  const [error, setError] = useState<string>('')

  const [loading, setLoading] = useState<boolean>(true)

  function actionCloseHandler() {
    setActionOpen(false)
    // Wait for the modal to close before resetting the action and proposal.
    setTimeout(() => {
      setActionProposal({} as ProposalExisting)
      setActionAction(Action.submit)
    }, 400)
  }

  // actionUpdateHandler updates the status of a proposal in the list
  // of proposals without making a request to the server.
  function actionUpdateHandler(id: string, status: Status) {
    setProposals(
      proposals.map((p) => {
        if (p._id === id) {
          p.status = status
        }
        return p
      }),
    )
    window.history.replaceState({}, document.title, window.location.pathname)
  }

  async function actionHandler(proposal: ProposalExisting, action: Action) {
    setActionAction(action)
    setActionProposal(proposal)
    setActionOpen(true)
  }

  useEffect(() => {
    if (confirm) {
      const proposal = proposals.find((p) => p._id === confirm)
      if (proposal && proposal.status === Status.accepted) {
        actionHandler(proposal, Action.confirm)
      }
    }
  }, [confirm, proposals])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { proposals, error } = await listProposals()
        if (error) setError(error.message)
        if (proposals) setProposals(proposals)
      } catch (error) {
        setError('Error fetching proposals from server.')
        console.error(error)
      }
      setLoading(false)
    }

    fetchData()
  }, [])

  return (
    <Layout>
      <div className="relative py-20 sm:pb-24 sm:pt-36">
        <BackgroundImage className="-bottom-14 -top-36" />
        <Container className="relative">
          <div className="mx-auto max-w-2xl lg:max-w-4xl lg:px-12">
            <h1 className="font-display text-5xl font-bold tracking-tighter text-blue-600 sm:text-7xl">
              Speaker Dashboard
              {c?.cfpOpen && (
                <a href="/cfp/submit">
                  <PlusCircleIcon className="ml-8 inline-block h-14 w-14 text-blue-600 hover:text-blue-500" />
                </a>
              )}
            </h1>
            <div className="mt-6 space-y-6 font-display text-2xl tracking-tight text-blue-900">
              <p>
                Than you for your interest in submitting a presentation to our
                conference.
              </p>
            </div>
          </div>
          {success && <Success />}
          {loading ? (
            <div className="mb-12 mt-12 flex justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {proposals.length === 0 ? (
                <div className="mx-auto mt-12 flex max-w-2xl flex-col items-center rounded-lg border-2 border-dashed border-blue-600 bg-white p-6 lg:max-w-4xl lg:px-12">
                  <p className="text-lg font-semibold text-gray-900">
                    You have no proposals yet.
                  </p>
                  {c?.cfpOpen && (
                    <>
                      <p className="mt-2 text-sm text-gray-500">
                        Submit a proposal to become a speaker.
                      </p>
                      <a
                        href="/cfp/submit"
                        className="mt-4 rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        Submit Proposal
                      </a>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <ProposalActionModal
                    open={actionOpen}
                    action={actionAction}
                    close={actionCloseHandler}
                    proposal={actionProposal}
                    onAction={actionUpdateHandler}
                  />
                  <ProposalCards proposals={proposals} action={actionHandler} />
                </>
              )}
            </>
          )}
        </Container>
      </div>
    </Layout>
  )
}
