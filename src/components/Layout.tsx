import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { headers } from 'next/headers';
import { getConferenceForDomain } from '@/lib/conference/sanity';

export async function Layout({
  children,
  showFooter = true,
}: {
  children: React.ReactNode
  showFooter?: boolean
}) {
  const headersList = headers();
  const domain = headersList.get('host') || '';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { conference, error } = await getConferenceForDomain(domain);

  return (
    <>
      <Header c={conference} />
      <main className="flex-auto">{children}</main>
      {showFooter && <Footer c={conference} />}
    </>
  )
}
