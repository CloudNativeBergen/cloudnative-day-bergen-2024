'use client'

import { BackgroundImage } from '@/components/BackgroundImage'
import { Container } from '@/components/Container'
import { Layout } from '@/components/Layout'
import { Proposal } from '@/types/proposal'
import { useState, useEffect } from 'react'
import { listProposals } from '@/lib/proposalClient'
import { ChevronRightIcon } from '@heroicons/react/24/solid'
import { parseCookies } from 'nookies';
import { NextRequest } from 'next/server'

// eslint-disable-next-line @next/next/no-async-client-component
export default function MyProposals(req: NextRequest) {
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
            </h1>
            <div className="mt-6 space-y-6 font-display text-2xl tracking-tight text-blue-900">
              <p>
                Than you for your interest in submitting a presentation to our conference.
              </p>
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center mt-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <ul
              role="list"
              className="divide-y divide-gray-100 overflow-hidden mx-auto max-w-2xl lg:max-w-4xl mt-12 bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl"
            >
              {proposals.map((proposal) => (
                <li key={proposal._id} className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6">
                  <div className="flex min-w-0 gap-x-4">
                    <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src="https://via.placeholder.com/48" alt="" />
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
                      <p className="text-sm leading-6 text-gray-900">{proposal.status}</p>
                      {proposal._updatedAt ? (
                        <p className="mt-1 text-xs leading-5 text-gray-500">
                          Last updated <time dateTime={proposal._updatedAt}>{proposal._updatedAt}</time>
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
          )}
        </Container>
      </div>
    </Layout >
  )
}

