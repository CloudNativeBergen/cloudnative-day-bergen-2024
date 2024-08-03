'use client'

import { BackgroundImage } from '@/components/BackgroundImage'
import { Container } from '@/components/Container'
import { Layout } from '@/components/Layout'
import { ProposalExisting, Action, Status } from '@/lib/proposal/types'
import { useState, useEffect } from 'react'
import { listAllProposals } from '@/lib/proposal/client'
import { FormatFormat, FormatLanguage, FormatLevel, FormatStatus } from '@/lib/proposal/format'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import {
  ArchiveBoxXMarkIcon,
  ChevronDownIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/20/solid'
import { Speaker } from '@/lib/speaker/types'
import { ProposalActionModal } from '@/components/ProposalActionModal'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function Dropdown({ proposal, acceptRejectHandler }: { proposal: ProposalExisting, acceptRejectHandler: (proposal: ProposalExisting, action: Action) => void }) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          Options
          <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
        </MenuButton>
      </div>

      <Transition
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <MenuItem disabled>
              {({ focus }) => (
                <span className='group flex items-center px-4 py-2 text-sm text-gray-300'>
                  <PencilSquareIcon
                    className="mr-3 h-5 w-5 text-gray-300"
                    aria-hidden="true"
                  />
                  Edit
                </span>
              )}
            </MenuItem>
            <MenuItem>
              {({ focus }) => (
                <a
                  href={`https://cloudnativebergen.sanity.studio/studio/structure/talk;${proposal._id}`}
                  className={classNames(
                    focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'group flex items-center px-4 py-2 text-sm'
                  )}
                >
                  <MagnifyingGlassIcon
                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  Open in Sanity
                </a>
              )}
            </MenuItem>
          </div>
          <div className="py-1">
            <MenuItem>
              {({ focus }) => (
                <a
                  href='#'
                  onClick={() => { acceptRejectHandler(proposal, Action.accept) }}
                  className={classNames(
                    focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'group flex items-center px-4 py-2 text-sm'
                  )}
                >
                  <HeartIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                  Accept
                </a>
              )}
            </MenuItem>
            <MenuItem>
              {({ focus }) => (
                <a
                  href='#'
                  onClick={() => { acceptRejectHandler(proposal, Action.reject) }}
                  className={classNames(
                    focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'group flex items-center px-4 py-2 text-sm'
                  )}
                >
                  <ArchiveBoxXMarkIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                  Reject
                </a>
              )}
            </MenuItem>
          </div>
          <div className="py-1">
            <MenuItem disabled>
              {({ focus }) => (
                <span className='group flex items-center px-4 py-2 text-sm text-gray-300'>
                  <TrashIcon className="mr-3 h-5 w-5 text-gray-300" aria-hidden="true" />
                  Delete
                </span>
              )}
            </MenuItem>
          </div>
        </MenuItems>
      </Transition>
    </Menu >
  )
}

function ProposalTable({ proposals, acceptRejectHandler }: { proposals: ProposalExisting[], acceptRejectHandler: (proposal: ProposalExisting, action: Action) => void }) {

  const total = proposals.length
  const speakers = Array.from(new Set(proposals.map((proposal) => proposal.speaker && 'name' in proposal.speaker ? (proposal.speaker as Speaker).name : 'Unknown author')));
  const accepted = proposals.filter((p) => p.status === Status.accepted).length
  const confirmed = proposals.filter((p) => p.status === Status.confirmed).length
  const rejected = proposals.filter((p) => p.status === Status.rejected).length

  return (
    <div className="px-4 sm:px-6 lg:px-8 ">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Proposals</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all proposals submitted by speakers (drafts are not shown)
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <p className="text-3xl font-semibold text-gray-900">{total}</p>
            <p className="text-sm text-gray-500">Total</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-3xl font-semibold text-gray-900">{speakers.length}</p>
            <p className="text-sm text-gray-500">Speakers</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-3xl font-semibold text-green-500">{accepted}</p>
            <p className="text-sm text-gray-500">Accepted</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-3xl font-semibold text-blue-500">{confirmed}</p>
            <p className="text-sm text-gray-500">Confirmed</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-3xl font-semibold text-red-500">{rejected}</p>
            <p className="text-sm text-gray-500">Rejected</p>
          </div>
        </div>
      </div>
      <div className="mt-8 flow-root">
        {/* @TODO make overflow play nice with the dropdown on smaller screens */}
        <div className="-mx-4 -my-2 overflow-x-auto overflow-y-visible md:overflow-x-visible sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    Title
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Speaker
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Format
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Language
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Level
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {proposals.map((proposal) => (
                  <tr key={proposal._id}>
                    <td className="whitespace-nowrap md:whitespace-normal py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      {proposal.title}
                    </td>
                    <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                      {proposal.speaker && 'name' in proposal.speaker ? (proposal.speaker as Speaker).name : 'Unknown author'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <FormatFormat format={proposal.format} />
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <FormatLanguage language={proposal.language} />
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <FormatLevel level={proposal.level} />
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <FormatStatus status={proposal.status} />
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <Dropdown proposal={proposal} acceptRejectHandler={acceptRejectHandler} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div >
  )
}

export default function AllProposals() {
  const [actionOpen, setActionOpen] = useState(false)
  const [actionProposal, setActionProposal] = useState<ProposalExisting>({} as ProposalExisting)
  const [actionAction, setActionAction] = useState<Action>(Action.accept)

  const [proposals, setProposals] = useState<ProposalExisting[]>([]);
  const [error, setError] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(true);

  function acceptRejectClickHandler(proposal: ProposalExisting, action: Action) {
    setActionProposal(proposal)
    setActionAction(action)
    setActionOpen(true)
  }

  function modalCloseHandler() {
    setActionOpen(false)
    setActionProposal({} as ProposalExisting)
    setActionAction(Action.accept)
  }

  function modalActionHandler(id: string, status: Status) {
    const updatedProposals = proposals.map((p) => {
      if (p._id === id) {
        return { ...p, status }
      }
      return p
    })
    setProposals(updatedProposals)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { proposals, error } = await listAllProposals();
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
      <ProposalActionModal open={actionOpen} close={modalCloseHandler} onAction={modalActionHandler} proposal={actionProposal} action={actionAction} adminUI={true} />
      <div className="relative py-20 sm:pb-24 sm:pt-36">
        <BackgroundImage className="-bottom-14 -top-36" />
        <Container className="relative">
          <div className="mx-auto max-w-2xl lg:max-w-4xl lg:px-12">
            <h1 className="font-display text-5xl font-bold tracking-tighter text-blue-600 sm:text-7xl">
              Admin Dashboard
            </h1>
          </div>
          {loading ? (
            <div className="flex justify-center mt-12 mb-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {proposals.length === 0 ? (
                <div className="flex flex-col items-center mx-auto p-6 mt-12 max-w-2xl lg:max-w-4xl lg:px-12 bg-white rounded-lg border-dashed border-2 border-blue-600">
                  <p className="text-lg font-semibold text-gray-900">No proposals submitted yet.</p>
                  <p className="mt-2 text-sm text-gray-500">Ask speakers to submit proposals for the conference.</p>
                </div>
              ) : (
                <div className="mx-auto max-w-4xl lg:max-w-6xl mt-12 pt-4 bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
                  <ProposalTable proposals={proposals} acceptRejectHandler={acceptRejectClickHandler} />
                </div>
              )}
            </>
          )}
        </Container>
      </div>
    </Layout >
  )
}

