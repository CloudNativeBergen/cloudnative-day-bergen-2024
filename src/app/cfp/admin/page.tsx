'use client'

import { BackgroundImage } from '@/components/BackgroundImage'
import { Container } from '@/components/Container'
import { Layout } from '@/components/Layout'
import { Proposal } from '@/lib/proposal/types'
import { useState, useEffect } from 'react'
import { listAllProposals } from '@/lib/proposal/client'
import { formatDate } from '@/lib/time'
import { FormatFormat, FormatLanguage, FormatLevel, FormatStatus } from '@/lib/proposal/format'

function ProposalTable({ proposals }: { proposals: Proposal[] }) {
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
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
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
                      <a href={`https://cloudnativebergen.sanity.studio/studio/structure/talk;${proposal._id}`} className="text-indigo-600 hover:text-indigo-900">
                        View in Sanity<span className="sr-only">, {proposal.title}</span>
                      </a>
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
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [error, setError] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(true);

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
                  <ProposalTable proposals={proposals} />
                </div>
              )}
            </>
          )}
        </Container>
      </div>
    </Layout >
  )
}

