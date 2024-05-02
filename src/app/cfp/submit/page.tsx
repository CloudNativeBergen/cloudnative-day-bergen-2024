'use client'

import { ExclamationCircleIcon, UserCircleIcon, XCircleIcon } from '@heroicons/react/24/solid'
import { BackgroundImage } from '@/components/BackgroundImage'
import { Container } from '@/components/Container'
import { Layout } from '@/components/Layout'
import { Format, Language, Level, Proposal, ProposalResponse, FormError } from '@/lib/proposal/types'
import { useState, useEffect } from 'react'
import { getProposal, postProposal } from '@/lib/proposal/client'
import { formats, languages, levels } from '@/lib/proposal/types'
import { Input, Textarea, Dropdown, HelpText, Checkbox, LinkInput, ErrorText } from '@/components/Form'
import { useRouter, useSearchParams } from 'next/navigation'
import { Speaker } from '@/lib/speaker/types'
import { ProfileEmail, ProfileImageResponse } from '@/lib/profile/types'
import { getEmails, getProfile, putProfile, postImage, putEmail } from '@/lib/profile/client'
import config from '@/../next.config'

export const dynamic = 'force-dynamic'

const { publicRuntimeConfig: c } = config;

export default function Submit() {

  const searchParams = useSearchParams()
  const id = searchParams.get('id') ?? undefined

  let [isLoading, setIsLoading] = useState(true)
  let [proposal, setProposal] = useState<Proposal>({ title: '', language: Language.norwegian, description: '', format: Format.lightning_10, level: Level.beginner, outline: '', tos: false });
  let [speaker, setSpeaker] = useState<Speaker>({ name: '', is_local: false, is_first_time: false, is_diverse: false });
  let [emails, setEmails] = useState<ProfileEmail[]>([]);
  let [loadingError, setLoadingError] = useState({} as FormError);

  const fetchProposal = async (id: string) => {
    const [proposal, emails] = await Promise.all([getProposal(id), getEmails()]);

    if (proposal.error) {
      console.error("Fetching proposal failed", proposal.error);
      setLoadingError(proposal.error);
      return;
    }

    if (emails.error) {
      console.error("Fetching emails failed", emails.error);
      setLoadingError(emails.error);
      return;
    }

    if (proposal.proposal) {
      setProposal(proposal.proposal);
      setSpeaker(proposal.proposal.speaker!);
      setEmails(emails.emails);
      setIsLoading(false);
    }
  };

  const fetchSpeaker = async () => {
    const [speaker, emails] = await Promise.all([getProfile(), getEmails()]);

    if (speaker.error) {
      console.error("Fetching speaker failed", speaker.error);
      setLoadingError(speaker.error);
      return;
    }

    if (emails.error) {
      console.error("Fetching emails failed", emails.error);
      setLoadingError(emails.error);
      return;
    }

    if (speaker.speaker) {
      setSpeaker(speaker.speaker);
      setEmails(emails.emails);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProposal(id);
    } else {
      fetchSpeaker();
    }
  }, [id]);

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
          {loadingError.type && (
            <div className="mt-12 p-4 mx-auto max-w-2xl lg:max-w-4xl lg:px-12 rounded-md bg-red-50">
              <div className="flex">
                <div className="flex-shrink-0">
                  <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Loading failed: {loadingError.type}</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{loadingError.message}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="mt-12 p-6 mx-auto max-w-2xl lg:max-w-4xl lg:px-12 bg-white rounded-lg">
            {isLoading ? (
              <div className="flex justify-center mt-12 mb-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <Form proposal={proposal} setProposal={setProposal} speaker={speaker} setSpeaker={setSpeaker} id={id} emails={emails} />
            )}
          </div>
        </Container>
      </div>
    </Layout>
  )
}

function Form({ proposal, setProposal, speaker, setSpeaker, id, emails }: { proposal: Proposal, setProposal: any, speaker: Speaker, setSpeaker: any, id?: string, emails: ProfileEmail[] }) {
  const buttonPrimary = id ? 'Update' : 'Submit';
  const buttonPrimaryLoading = id ? 'Updating...' : 'Submitting...';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proposalSubmitError, setProposalSubmitError] = useState({} as FormError);

  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    const proposalRes = await postProposal(proposal, id);
    if (proposalRes.error) {
      setProposalSubmitError(proposalRes.error);
      setIsSubmitting(false);
      window.scrollTo(0, 0);
    }

    const speakerRes = await putProfile(speaker);
    if (speakerRes.error) {
      setProposalSubmitError(speakerRes.error);
      setIsSubmitting(false);
      window.scrollTo(0, 0);
    }

    if (!proposalRes.error && !speakerRes.error) {
      router.push(`/cfp/list${!id ? "?success=true" : ""}`)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-12">
        {proposalSubmitError.type && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Submission failed: {proposalSubmitError.type}</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{proposalSubmitError.message}</p>
                  {proposalSubmitError.validationErrors && proposalSubmitError.validationErrors.length > 0 && (
                    <ul className="mt-2 list-disc list-inside text-sm text-red-700">
                      {proposalSubmitError.validationErrors.map((error) => (
                        <li key={error.field}>{error.message}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        <ProposalForm proposal={proposal} setProposal={setProposal} />
        <SpeakerProfileForm speaker={speaker} setSpeaker={setSpeaker} emails={emails} />
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <a href="/cfp/list" type="button" className="text-sm font-semibold leading-6 text-gray-900">
          Cancel
        </a>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {isSubmitting ? buttonPrimaryLoading : buttonPrimary}
        </button>
      </div>
    </form>
  )
}

function ProposalForm({ proposal, setProposal }: { proposal: Proposal, setProposal: any }) {

  const [title, setTitle] = useState(proposal?.title ?? '')
  const [language, setLanguage] = useState(proposal?.language ?? Language.norwegian)
  const [description, setDescription] = useState(proposal?.description ?? '')
  const [format, setFormat] = useState(proposal?.format ?? Format.lightning_10)
  const [level, setLevel] = useState(proposal?.level ?? Level.beginner)
  const [outline, setOutline] = useState(proposal?.outline ?? '')
  const [tos, setTos] = useState(proposal?.tos ?? false)

  useEffect(() => {
    setProposal({ title, language, description, format, level, outline, tos });
  }, [title, language, description, format, level, outline, tos]);

  return (
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
          <Checkbox name="tos" label="I agree to the CNCF Code of Conduct" value={tos} setValue={setTos}>
            <HelpText>You must agree to the <a href={c?.cocLink ?? '#'} className='text-indigo-500 hover:text-indigo-700 underline'>CNCF Code of Conduct</a> to submit your presentation.</HelpText>
          </Checkbox>
        </div>
      </div>
    </div>
  )
}

function SpeakerProfileForm({ speaker, setSpeaker, emails }: { speaker: Speaker, setSpeaker: any, emails: ProfileEmail[] }) {
  const [speakerName, setSpeakerName] = useState(speaker?.name ?? '')
  const [speakerTitle, setSpeakerTitle] = useState(speaker?.title ?? '')
  const [speakerBio, setSpeakerBio] = useState(speaker?.bio ?? '')
  const [speakerEmail, setSpeakerEmail] = useState(speaker?.email ?? '')
  const [speakerImage, setSpeakerImage] = useState(speaker?.image ?? '')
  const [speakerIsLocal, setSpeakerIsLocal] = useState(speaker?.is_local ?? false)
  const [speakerIsFirstTime, setSpeakerIsFirstTime] = useState(speaker?.is_first_time ?? false)
  const [speakerIsDiverse, setSpeakerIsDiverse] = useState(speaker?.is_diverse ?? false)
  const [speakerLinks, setSpeakerLinks] = useState(speaker?.links ?? [''])

  const [imageError, setImageError] = useState('')
  const [isUploading, setIsUploading] = useState(false);

  const emailOptions = new Map(emails.map(email => [email.email, email.email]));

  function updateSpeakerLink(i: number, val: string) {
    setSpeakerLinks(speakerLinks.map((link, index) => index === i ? val : link))
  }

  function addSpeakerLink(i: number) {
    setSpeakerLinks([...speakerLinks, ''])
  }

  function removeSpeakerLink(i: number) {
    const links = speakerLinks.filter((link, index) => index !== i)
    if (links.length === 0) {
      links.push('')
    }
    setSpeakerLinks(links)
  }

  async function imageUploadHandler(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      const { error, image } = await postImage(e.target.files[0]);

      if (error) {
        setImageError(error.message);
      } else if (image) {
        setSpeakerImage(image.image);
      }

      setIsUploading(false);
    }
  }

  async function emailSelectHandler(email: string) {
    const res = await putEmail(email);
    if (res.error) {
      // @TODO: display error message
      console.error("Error updating email", res.error);
    } else {
      setSpeakerEmail(email);
    }
  }

  useEffect(() => {
    const links = speakerLinks.filter(link => link.length > 0);

    setSpeaker({
      name: speakerName,
      title: speakerTitle,
      bio: speakerBio,
      is_local: speakerIsLocal,
      is_first_time: speakerIsFirstTime,
      is_diverse: speakerIsDiverse,
      links,
    });
  }, [speakerName, speakerTitle, speakerBio, speakerIsLocal, speakerIsFirstTime, speakerIsDiverse, speakerLinks]);

  return (
    <div className="border-b border-gray-900/10 pb-12">
      <h2 className="text-base font-semibold leading-7 text-gray-900">Speaker Information</h2>
      <p className="mt-1 text-sm leading-6 text-gray-600">We need information about you as the speaker.</p>

      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-4">
          <Input name="speaker_name" label="Name" value={speakerName} setValue={setSpeakerName} />
        </div>

        <div className="sm:col-span-4">
          <Input name="speaker_title" label="Title or affiliation" value={speakerTitle} setValue={setSpeakerTitle} />
        </div>

        <div className="col-span-full">
          <Textarea name="speaker_bio" label="Bio" rows={3} value={speakerBio} setValue={setSpeakerBio} />
          <HelpText>This is what will be displayed to the audience on the conference website. It should provide information about you as a speaker and your expertise.</HelpText>
        </div>

        <div className="sm:col-span-4">
          <Dropdown name="speaker_email" label="Email address" value={speakerEmail} setValue={emailSelectHandler} options={emailOptions} />
          <HelpText>Your email address will not be displayed publicly. It will only be used to contact you regarding your presentation.</HelpText>
        </div>

        <div className="col-span-full">
          <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
            Photo
          </label>
          <div className="mt-2 flex items-center gap-x-3">
            {speakerImage ? (
              <img src={`${speakerImage}?w=96&h=96&fit=crop`} alt="Speaker Image" className="h-12 w-12 rounded-full" />
            ) : (
              <UserCircleIcon className="h-12 w-12 text-gray-300" aria-hidden="true" />
            )}
            <input
              type="file"
              id="photo"
              className="sr-only"
              accept="image/*"
              onChange={imageUploadHandler}
            />
            {isUploading ? (
              <div className="flex items-center gap-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-500"></div>
                <p className="text-sm font-medium leading-6 text-gray-900">Uploading...</p>
              </div>
            ) : (
              <label htmlFor="photo" className="cursor-pointer">
                <span className="text-sm font-medium leading-6 text-gray-900">Upload Photo</span>
              </label>
            )}
          </div>
          {imageError ? (
            <ErrorText>{imageError}</ErrorText>
          ) : (
            <HelpText>Your photo will be displayed on the conference website.</HelpText>
          )}
        </div>

        <div className="sm:col-span-4">
          <fieldset>
            <legend className="text-sm font-semibold leading-6 text-gray-900">Social profiles and links</legend>
            <HelpText>Provide links to your social profiles, personal website or other relevant links you want to share with the audience.</HelpText>
            <div className="mt-6 space-y-6">
              {speakerLinks.map((link, index) => (
                <LinkInput index={index} key={`speaker_link_${index} `} name={`speaker_link_${index} `} value={link} update={updateSpeakerLink} remove={removeSpeakerLink} add={addSpeakerLink} />
              ))}
            </div>
          </fieldset>
        </div>

        <div className="col-span-full">
          <fieldset>
            <legend className="text-sm font-semibold leading-6 text-gray-900">Speaker Details</legend>
            <div className="mt-6 space-y-6">
              <Checkbox name="local" label="I am a local speaker" value={speakerIsLocal} setValue={setSpeakerIsLocal}>
                <HelpText>Local speakers are given priority and are more likely to be selected.</HelpText>
              </Checkbox>

              <Checkbox name="first-time" label="I am a first time speaker" value={speakerIsFirstTime} setValue={setSpeakerIsFirstTime}>
                <HelpText>We encourage first time speakers to submit presentations.</HelpText>
              </Checkbox>

              <Checkbox name="diversity" label="I am from an underrepresented group" value={speakerIsDiverse} setValue={setSpeakerIsDiverse}>
                <HelpText>We are committed to increasing diversity among our selected speakers.</HelpText>
              </Checkbox>
            </div>
          </fieldset>
        </div>
      </div >
    </div >
  )
}
