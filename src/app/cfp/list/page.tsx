'use client'

import { BackgroundImage } from '@/components/BackgroundImage'
import { Container } from '@/components/Container'
import { Layout } from '@/components/Layout'
import { Proposal, Status, statuses } from '@/lib/proposal/types'
import { useState, useEffect } from 'react'
import { listProposals } from '@/lib/proposal/client'
import { CheckCircleIcon, ChevronRightIcon, XMarkIcon, PlusCircleIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { formatDate } from '@/lib/time'
import { useSearchParams } from 'next/navigation'

function ProposalStatus({ status }: { status?: string }) {
  let text: string;
  let color: string;

  switch (status) {
    case Status.submitted:
      text = statuses.get(Status.submitted) ?? status;
      color = 'bg-blue-100 text-blue-800';
      break;
    case Status.selected:
      text = statuses.get(Status.selected) ?? status;
      color = 'bg-indigo-100 text-indigo-800';
      break;
    case Status.accepted:
      text = statuses.get(Status.accepted) ?? status;
      color = 'bg-green-100 text-green-800';
      break;
    case Status.rejected:
      text = statuses.get(Status.rejected) ?? status;
      color = 'bg-red-100 text-red-800';
      break;
    default:
      text = 'Unknown';
      color = 'bg-gray-100 text-gray-800';
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {text}
    </span>
  )
}

function ProposalList({ proposals }: { proposals: Proposal[] }) {
  return (
    <ul
      role="list"
      className="divide-y divide-gray-100 overflow-hidden mx-auto max-w-2xl lg:max-w-4xl mt-12 bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl"
    >
      {proposals.map((proposal) => (
        <li key={proposal._id} className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6">
          <div className="flex min-w-0 gap-x-4">
            {proposal.speaker?.image ? (
              <img
                className="h-12 w-12 flex-none rounded-full bg-gray-50"
                src={`${proposal.speaker.image}?w=96&h=96&fit=crop`}
                alt="Speaker Image" />
            ) : (
              <UserCircleIcon className="h-12 w-12 text-gray-300" aria-hidden="true" />
            )}
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6 text-gray-900">
                <a href={`/cfp/submit?id=${proposal._id}`}>
                  <span className="absolute inset-x-0 -top-px bottom-0" />
                  {proposal.title}
                </a>
              </p>
              <p className="mt-1 flex text-xs leading-5 text-gray-500">
                {proposal.description}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-x-4">
            <div className="hidden sm:flex sm:flex-col sm:items-end">
              <p className="text-sm leading-6 text-gray-900">
                <ProposalStatus status={proposal.status} />
              </p>
              {proposal._updatedAt ? (
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Submitted <time dateTime={proposal._updatedAt}>{formatDate(proposal._updatedAt)}</time>
                </p>
              ) : (
                <div className="mt-1 flex items-center gap-x-1.5">
                  <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-xs leading-5 text-gray-500">Online</p>
                </div>
              )}
            </div>
            <ChevronRightIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
          </div>
        </li>
      ))}
    </ul>
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
                <ProposalList proposals={proposals} />
              )}
            </>
          )}
        </Container>
      </div>
    </Layout >
  )
}

