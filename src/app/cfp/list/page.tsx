'use client'

import { BackgroundImage } from '@/components/BackgroundImage'
import { Container } from '@/components/Container'
import { Layout } from '@/components/Layout'
import { Proposal, Status, Action } from '@/lib/proposal/types'
import { useState, useEffect } from 'react'
import { listProposals, postProposalAction } from '@/lib/proposal/client'
import { useSearchParams } from 'next/navigation'
import { FormatStatus } from '@/lib/proposal/format'
import { CheckCircleIcon, XMarkIcon, PlusCircleIcon, EnvelopeIcon, PencilIcon, UserCircleIcon } from '@heroicons/react/20/solid'
import { SpinnerIcon } from '@/components/SocialIcons'

interface ButtonAction {
  label: Action
  icon: any
  link?: string
  onClick?: () => void
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function ActionLink({ action }: { action: ButtonAction }) {
  return (
    <a href={action.link} className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 border border-transparent py-4 text-sm font-semibold text-gray-900">
      <action.icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      {action.label}
    </a>
  )
}

function ActionButton({ action, isLoading }: { action: ButtonAction, isLoading: boolean }) {
  console.log('action', action.label, 'isLoading', isLoading)
  return (
    <button
      disabled={isLoading}
      onClick={action.onClick}
      className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 border border-transparent py-4 text-sm font-semibold text-gray-900"
    >
      {(isLoading) ? (
        <>
          <SpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-grey-400" />
          {action.label}...
        </>
      ) : (
        <>
          <action.icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          {action.label}
        </>
      )}
    </button>
  )
}

function ProposalCards({ proposals, action }: { proposals: Proposal[], action: (id: string, action: Action) => void }) {
  const [loading, setLoading] = useState<{ id: string, action: string }>({ id: '', action: '' });
  console.log(loading)

  return (
    <ul role="list" className="mt-6 mx-auto max-w-2xl lg:max-w-4xl grid grid-cols-1 gap-6 sm:grid-cols-2">
      {proposals.map(proposal => {
        const actions: ButtonAction[] = [];

        if (proposal.status === Status.draft || proposal.status === Status.submitted) {
          actions.push({
            label: Action.edit,
            icon: PencilIcon,
            link: `/cfp/submit?id=${proposal._id}`,
          })
        }

        if (proposal.status === Status.draft) {
          actions.push({
            label: Action.submit,
            icon: EnvelopeIcon,
            onClick: async () => {
              setLoading({ id: proposal._id!, action: Action.submit })
              action(proposal._id!, Action.submit)
            }
          })
        }

        if (proposal.status === Status.submitted) {
          actions.push({
            label: Action.unsubmit,
            icon: XMarkIcon,
            onClick: () => {
              setLoading({ id: proposal._id!, action: Action.unsubmit })
              action(proposal._id!, Action.unsubmit)
            }
          })
        }

        if (proposal.status === Status.confirmed || proposal.status === Status.accepted) {
          actions.push({
            label: Action.withdraw,
            icon: XMarkIcon,
            onClick: () => {
              setLoading({ id: proposal._id!, action: 'Withdraw' })
              action(proposal._id!, Action.withdraw)
            }
          })
        }

        if (proposal.status === Status.accepted) {
          actions.push({
            label: Action.confirm,
            icon: CheckCircleIcon,
            onClick: () => {
              setLoading({ id: proposal._id!, action: 'Confirm' })
              action(proposal._id!, Action.confirm)
            }
          })
        }

        return (
          <li key={proposal._id} className={classNames(
            proposal.status === Status.accepted ? 'border-green-500/50 border-2' : '',
            'col-span-1 divide-y divide-gray-200 bg-white rounded-lg shadow'
          )}>
            <div className="flex w-full items-center justify-between space-x-6 p-6">
              <div className="flex-1 truncate">
                <div className="flex items-center space-x-3">
                  <h3 className="truncate text-sm font-medium text-gray-900">{proposal.title}</h3>
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
              {proposal.speaker?.image ? (
                <img className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300" src={proposal.speaker?.image} alt="" />
              ) : (
                <UserCircleIcon className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300" aria-hidden="true" />
              )}
            </div>
            {(actions.length > 0) && (
              <div>
                <div className="-mt-px flex divide-x divide-gray-200">
                  {(actions.map((action, i) => (
                    <div key={`${proposal._id}-${action.label}`} className={classNames(
                      i > 0 ? '-ml-px' : '',
                      'relative inline-flex w-0 flex-1 flex'
                    )}>
                      {action.link ? (
                        <ActionLink action={action} />
                      ) : (
                        <ActionButton action={action} isLoading={loading.id === proposal._id && loading.action === action.label} />
                      )}
                    </div>
                  )))}
                </div>
              </div>
            )}
          </li>
        )
      })}
    </ul >
  )
}

function Success() {
  const [showMessage, setShowMessage] = useState(true);

  const dismissMessage = () => {
    window.history.replaceState({}, document.title, window.location.pathname);
    setShowMessage(false);
  };

  return (
    <>
      {showMessage && (
        <div className="flex flex-col mx-auto max-w-2xl lg:max-w-4xl lg:px-12 rounded-md bg-green-50 mt-6 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">Proposal submitted successfully.</p>
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
  );
}

export default function MyProposals() {
  const searchParams = useSearchParams()
  const success = searchParams.get('success') ?? undefined

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [error, setError] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(true);

  async function actionHandler(id: string, action: Action) {
    const res = await postProposalAction(id, action, false, '')
    if (res.error) {
      setError(res.error.message)
    } else if (res.proposalStatus) {
      setProposals(proposals.map(proposal => {
        if (proposal._id === id) {
          proposal.status = res.proposalStatus!
        }
        return proposal
      }))
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { proposals, error } = await listProposals();
        if (error) setError(error.message);
        if (proposals) setProposals(proposals);
      } catch (error) {
        setError('Error fetching proposals from server.');
        console.error(error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <div className="relative py-20 sm:pb-24 sm:pt-36">
        <BackgroundImage className="-bottom-14 -top-36" />
        <Container className="relative">
          <div className="mx-auto max-w-2xl lg:max-w-4xl lg:px-12">
            <h1 className="font-display text-5xl font-bold tracking-tighter text-blue-600 sm:text-7xl">
              Speaker Dashboard
              <a href='/cfp/submit'>
                <PlusCircleIcon className="h-14 w-14 inline-block ml-8 text-blue-600 hover:text-blue-500" />
              </a>
            </h1>
            <div className="mt-6 space-y-6 font-display text-2xl tracking-tight text-blue-900">
              <p>
                Than you for your interest in submitting a presentation to our conference.
              </p>
            </div>
          </div>
          {success && (
            <Success />
          )}
          {loading ? (
            <div className="flex justify-center mt-12 mb-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {proposals.length === 0 ? (
                <div className="flex flex-col items-center mx-auto p-6 mt-12 max-w-2xl lg:max-w-4xl lg:px-12 bg-white rounded-lg border-dashed border-2 border-blue-600">
                  <p className="text-lg font-semibold text-gray-900">You have no proposals yet.</p>
                  <p className="mt-2 text-sm text-gray-500">Submit a proposal to become a speaker.</p>
                  <a href="/cfp/submit" className="mt-4 px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Submit Proposal</a>
                </div>
              ) : (
                <>
                  <ProposalCards proposals={proposals} action={actionHandler} />
                </>
              )}
            </>
          )}
        </Container>
      </div>
    </Layout >
  )
}

