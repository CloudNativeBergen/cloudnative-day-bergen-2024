'use client'

import { BackgroundImage } from '@/components/BackgroundImage'
import { Container } from '@/components/Container'
import { Layout } from '@/components/Layout'
import { Proposal, ProposalActionResponse, Action } from '@/lib/proposal/types'
import { useState, useEffect } from 'react'
import { listAllProposals, postProposalAction } from '@/lib/proposal/client'
import { FormatFormat, FormatLanguage, FormatLevel, FormatStatus } from '@/lib/proposal/format'
import { Dialog, DialogPanel, DialogTitle, Menu, MenuButton, MenuItem, MenuItems, Transition, TransitionChild } from '@headlessui/react'
import {
  ArchiveBoxXMarkIcon,
  ChevronDownIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function Modal({ open, close, proposal, action, submit }: { open: boolean, close: () => void, proposal: Proposal, action: Action, submit: (proposal: Proposal, action: Action, notify: boolean, comment: string) => Promise<ProposalActionResponse> }) {
  const [error, setError] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [notify, setNotify] = useState<boolean>(false)
  const [comment, setComment] = useState<string>('')

  async function submitHandler() {
    setIsSubmitting(true)
    const res = await submit(proposal, action, notify, comment)

    if (res.error) {
      setError(res.error.message)
    } else {
      close()
    }

    setIsSubmitting(false)
  }

  return (
    <Transition show={open}>
      <Dialog className="relative z-10" onClose={close}>
        <TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => close()}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className={classNames(
                    action === Action.accept ? 'bg-green-100' : 'bg-red-100',
                    "mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10"
                  )}>
                    {action === Action.accept ?
                      <HeartIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                      : <ArchiveBoxXMarkIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                    }
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      {action === Action.accept ? 'Accept proposal' : 'Reject proposal'}
                    </DialogTitle>
                    <div className="mt-2">
                      {error && <p className="mb-2 text-sm text-red-500">
                        Server error: &quote;{error}&quote;
                      </p>}
                      <p className="text-sm text-gray-500">
                        Are you sure you want to {action === Action.accept ? 'accept' : 'reject'} the proposal <span className="font-semibold">{proposal.title}</span> by <span className="font-semibold">{proposal.speaker?.name ?? 'Unknown author'}</span>?
                      </p>
                      <div className="mt-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={notify}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            onChange={() => setNotify(!notify)}
                          />
                          <span className="ml-2 text-sm text-gray-700">Notify the speaker via email</span>
                        </label>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Comment
                        </label>
                        <textarea
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          rows={3}
                          placeholder="Add a comment..."
                          onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                        <p className="mt-2 text-sm text-gray-500">Your comment will be included in the email to the speaker.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    className={classNames(
                      action === Action.accept ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500',
                      isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer',
                      'inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto'
                    )}
                    onClick={() => submitHandler()}
                  >
                    {action === Action.accept ?
                      (isSubmitting ? 'Accepting...' : 'Accept')
                      :
                      (isSubmitting ? 'Rejecting...' : 'Reject')
                    }
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => close()}
                  >
                    Cancel
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition >
  )
}

function Dropdown({ proposal, acceptRejectHandler }: { proposal: Proposal, acceptRejectHandler: (proposal: Proposal, action: Action) => void }) {
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

function ProposalTable({ proposals, acceptRejectHandler }: { proposals: Proposal[], acceptRejectHandler: (proposal: Proposal, action: Action) => void }) {
  return (
    <div className="px-4 sm:px-6 lg:px-8 ">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Proposals</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all proposals submitted by speakers (drafts are not shown)
          </p>
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
                      {proposal.speaker?.name}
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
  const [actionProposal, setActionProposal] = useState<Proposal>({} as Proposal)
  const [actionAction, setActionAction] = useState<Action>(Action.accept)

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [error, setError] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(true);

  function acceptRejectClickHandler(proposal: Proposal, action: Action) {
    setActionProposal(proposal)
    setActionAction(action)
    setActionOpen(true)
  }

  function modalCloseHandler() {
    setActionOpen(false)
    setActionProposal({} as Proposal)
    setActionAction(Action.accept)
  }

  async function modalSubmitHandler(proposal: Proposal, action: Action, notify: boolean, comment: string): Promise<ProposalActionResponse> {
    const res = await postProposalAction(proposal._id!, action, notify, comment)

    if (res.proposalStatus) {
      const updatedProposals = proposals.map((p) => {
        if (p._id === proposal._id) {
          return { ...p, status: res.proposalStatus }
        }
        return p
      })
      setProposals(updatedProposals)
    }

    return res
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
      <Modal open={actionOpen} close={modalCloseHandler} submit={modalSubmitHandler} proposal={actionProposal} action={actionAction} />
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

