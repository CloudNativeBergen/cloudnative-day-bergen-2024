import { Container } from '@/components/Container'
import { Logo } from '@/components/Logo'
import { GitHubIcon, LinkedInIcon } from '@/components/SocialIcons'

export function Footer() {
  return (
    <footer className="flex-none py-16">
      <Container className="flex flex-col items-center justify-between md:flex-row">
        <Logo className="h-12 w-auto text-slate-900" />
        <div className="mt-6 flex space-x-4 md:mt-0">
          <a href="https://github.com/CloudNativeBergen" className="text-blue-800">
            <GitHubIcon className="w-12 h-12 fill-current" />
          </a>
          <a href="https://www.linkedin.com/company/cloud-native-bergen" className="text-blue-800">
            <LinkedInIcon className="w-12 h-12 fill-current" />
          </a>
        </div>
        <p className="mt-6 text-base text-slate-500 md:mt-0">
          Copyright &copy; {new Date().getFullYear()} CloudNative Bergen. All
          rights reserved.
        </p>
      </Container>
    </footer>
  )
}
