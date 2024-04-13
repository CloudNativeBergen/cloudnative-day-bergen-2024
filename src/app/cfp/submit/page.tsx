'use client'

import { XCircleIcon } from '@heroicons/react/24/solid'
import { BackgroundImage } from '@/components/BackgroundImage'
import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { Layout } from '@/components/Layout'
import { CFP as CFPType, CfpResponse } from '@/types/cfp'
import { useState, useEffect } from 'react'
import { getCfp, postCfp } from '@/lib/cfpClient'
import { formats, languages, levels } from '@/types/cfp'
import { Input, Textarea, Dropdown, HelpText, Checkbox } from '@/components/Form'
import { useSearchParams } from 'next/navigation'

export default function Submit() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id') ?? undefined

  const [cfp, setCfp] = useState<CFPType | null>(null);

  useEffect(() => {
    const fetchCfp = async () => {
      const data: CfpResponse = await getCfp(id as string);

      if (data.error) {
        // @TODO Show error message to user
        console.error(data.error);
        return;
      }

      if (data.cfp) {
        setCfp(data.cfp);
      }
    };

    fetchCfp();
  }, []);

  if (!cfp) {
    return <div>Loading...</div>; // or some loading spinner
  }

  return (
    <Layout>
      <div className="relative py-20 sm:pb-24 sm:pt-36">
        <BackgroundImage className="-bottom-14 -top-36" />
        <Container className="relative">
          <div className="mx-auto max-w-2xl lg:max-w-4xl lg:px-12">
            <h1 className="font-display text-5xl font-bold tracking-tighter text-blue-600 sm:text-7xl">
              Submit Presentation
            </h1>
            <div className="mt-6 space-y-6 font-display text-2xl tracking-tight text-blue-900">
              <p>
                Become our next speaker and share your knowledge with the community! We are especially interested in local speakers who can provide unique insights and perspectives.
              </p>
            </div>
          </div>
          <div className="mt-12 p-6 mx-auto max-w-2xl lg:max-w-4xl lg:px-12 bg-white rounded-lg">
            <Form data={cfp} id={id} />
          </div>
        </Container>
      </div>
    </Layout>
  )
}

export function Form({ data, id }: { data: CFPType, id?: string }) {
  const [title, setTitle] = useState(data.title)
  const [language, setLanguage] = useState(data.language)
  const [description, setDescription] = useState(data.description)
  const [format, setFormat] = useState(data.format)
  const [level, setLevel] = useState(data.level)
  const [outline, setOutline] = useState(data.outline)
  const [tos, setTos] = useState(data.tos)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsSubmitting(true);

    const cfp: CFPType = {
      title,
      language,
      description,
      format,
      level,
      outline,
      tos,
    };

    const response = await postCfp(cfp, id);

    if (response.error) {
      setFormError(response.error);
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-12">
        {formError !== '' && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Submission failed</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{formError}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Presentation Details</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Please provide the following details about your presentation.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-full">
              <Input name="title" label="Title" value={title} setValue={setTitle} />
            </div>

            <div className="sm:col-span-3">
              <Dropdown name="language" label="Language" value={language} setValue={setLanguage} options={languages} />
            </div>

            <div className="col-span-full">
              <Textarea name="description" label="Abstract" rows={5} value={description} setValue={setDescription} />
              <HelpText>This is what will be displayed to the audience on the conference website. It should make the reader want to attend your presentation.</HelpText>
            </div>

            <div className="sm:col-span-3">
              <Dropdown name="format" label="Presentation Format" value={format} setValue={setFormat} options={formats} />
            </div>

            <div className="sm:col-span-3">
              <Dropdown name="level" label="Skill Level" value={level} setValue={setLevel} options={levels} />
            </div>

            <div className="col-span-full">
              <Textarea name="outline" label="Outline (not public)" rows={3} value={outline} setValue={setOutline} />
              <HelpText>Provide a detailed outline of the content of your presentation. How do you plan to structure the presentation and what is the expected takeaways for the participants. This will only be visible to the organizers and not displayed on the website.</HelpText>
            </div>

            <div className="col-span-full">
              <Checkbox name="tos" label="I agree to the Terms of Service" value={tos} setValue={setTos}>
                <HelpText>You must agree to the Terms of Service to submit your presentation.</HelpText>
              </Checkbox>
            </div>

          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Speaker Information</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">We need information about you as the speaker.</p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <Input name="first-name" label="First name" />
            </div>

            <div className="sm:col-span-3">
              <Input name="last-name" label="Last name" />
            </div>

            <div className="sm:col-span-4">
              <Input name="email" label="Email address" type="email" />
            </div>

            <div className="sm:col-span-4">
              <Input name="title" label="Title" />
            </div>

            <div className="col-span-full">
              <fieldset>
                <legend className="text-sm font-semibold leading-6 text-gray-900">Speaker Details</legend>
                <div className="mt-6 space-y-6">
                  <Checkbox name="local" label="I am a local speaker">
                    <HelpText>Local speakers are given priority and are more likely to be selected.</HelpText>
                  </Checkbox>

                  <Checkbox name="first-time" label="I am a first time speaker">
                    <HelpText>We encourage first time speakers to submit presentations.</HelpText>
                  </Checkbox>

                  <Checkbox name="diversity" label="I am from an underrepresented group">
                    <HelpText>We are committed to increasing diversity among our speakers.</HelpText>
                  </Checkbox>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  )
}
