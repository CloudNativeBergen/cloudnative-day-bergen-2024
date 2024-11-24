import { Layout } from '@/components/Layout'
import { headers } from 'next/headers';
import { getConferenceForDomain } from '@/lib/conference/sanity';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = headers();
  const domain = headersList.get('host') || '';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { conference, error } = await getConferenceForDomain(domain);
  return <Layout conference={conference}>{children}</Layout>
}
