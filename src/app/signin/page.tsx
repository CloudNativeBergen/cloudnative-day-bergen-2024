import { BackgroundImage } from '@/components/BackgroundImage'
import { Container } from '@/components/Container'
import { Layout } from '@/components/Layout'
import { signIn, providerMap } from '@/lib/auth'

export default async function Signin() {
  return (
    <Layout>
      <div className="relative py-20 sm:pb-24 sm:pt-36">
        <BackgroundImage className="-bottom-14 -top-36" />
        <Container className="relative">
          <div className="mx-auto max-w-2xl lg:max-w-4xl lg:px-12">
            <h1 className="font-display text-5xl font-bold tracking-tighter text-blue-600 sm:text-7xl">
              Logg in
            </h1>

            <div className="mt-6 space-y-6 font-display text-2xl tracking-tight text-blue-900">
              {Object.values(providerMap).map((provider) => (
                <form
                  key={provider.id}
                  action={async () => {
                    'use server'
                    await signIn(provider.id)
                  }}
                >
                  <button type="submit">
                    <span>Sign in with {provider.name}</span>
                  </button>
                </form>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </Layout>
  )
}
