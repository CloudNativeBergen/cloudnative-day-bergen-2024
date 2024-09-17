import { Layout } from '@/components/Layout'
import getConfig from 'next/config'
import { formatDate } from '@/lib/time'

const { publicRuntimeConfig } = getConfig()
const { cocLink, dates, contact } = publicRuntimeConfig

const faqs = [
  {
    anchor: 'general',
    heading: 'For Attendees',
    description: 'Practical information for attending the conference.',
    questions: [
      {
        question: 'What is the date of the conference?',
        answer: `The conference will be held on ${formatDate(dates.conference)}.`,
      },
      {
        question: 'Where is the conference located?',
        answer: 'The conference will take place at the Academic Quater (Kvarteret) in Bergen, Norway. The address is Olav Kyrres gate 49. You can find more information about Kvarteret on their website at <u><a href="https://kvarteret.no">kvarteret.no</a></u>.',
      },
      {
        question: 'Is this venue accessible?',
        answer: 'Yes, the venue is accessible. If you have any special needs, please let us know in advance as a part of the ticket registration, and we will do our best to accommodate you.',
      },
      {
        question: 'What about allergies and dietary restrictions?',
        answer: 'We will serve food and drinks during the conference. If you have any allergies or dietary restrictions, please let us know in advance as a part of the ticket registration, and we will do our best to accommodate you.',
      },
      {
        question: 'When will the doors open?',
        answer: 'The doors will open for registration and coffee half an hour before the first talk starts.',
      },
      {
        question: 'What is the code of conduct?',
        answer: `We have a code of conduct that all attendees, speakers, and sponsors must follow. You can read the code of conduct on our website at <u><a href="${cocLink}">Code of Conduct</a></u>. If you have any questions or concerns, please contact us.`,
      },
      {
        question: 'What happens after the conference?',
        answer: 'After the conference, we will host an afterparty at the same venue. The afterparty will start at 6 PM and last until late 🌃 There will be food, drinks, and more opertunities to network with other attendees, speakers and sponsors. The afterparty is included in the conference ticket.',
      }
    ],
  },
  {
    anchor: 'speakers',
    heading: 'For Speakers',
    description: 'Information for our awesome speakers to make their experience as smooth as possible. If you have any other questions do not hesitate to contact us.',
    questions: [
      {
        question: 'Will there be a speaker dinner?',
        answer: 'Yes! We will host a complementary speaker dinner the evening before the conference at 5 PM. The dinner will be held at a restaurant on the highest mountain in Bergen, Ulriken, with a stunning view of the city.<br /> We will scheule joint transportation to the cable car station, or if you prefer, to hike up togehter with some of the organizers 🥾 You can find more information about Ulriken on their website at <u><a href="https://ulriken643.no/en/">ulriken643.no</a></u>.<br />We will send out more information about the speaker dinner closer to the event.',
      },
      {
        question: 'Can I make changes to my talk?',
        answer: 'Yes, you can make changes to your talk up until the day before the conference. You can edit your talk directly from our website by going to the <u><a href="/cfp/list">speaker dashboard</a></u>.',
      }
    ],
  },
  {
    anchor: 'sponsors',
    heading: 'For Sponsors',
    description: 'Information for our amazing sponsors that makes this event happening. If you have any questions, please contact us.',
    questions: [
      {
        question: 'How do I obtain the sponsor tickets?',
        answer: `Sponsors will receive a unique link to <u>checkin.no</u> to redeem their complimentary tickets prior to the conference. The email will be sent to the contact person listed in the sponsor agreement and can register all the tickets at once.<br />The email will be sent from <u>no-reply@messenger.checkin.no</u>. If you have not received your link, please check your spam folder or <u><a href="mailto:${contact.email}">contact us</a></u>.`,
      },
      {
        question: 'What should I do with the sponsor rollups?',
        answer: `You can bring your rollups to the venue on the day of the conference, or the day before. We will have a designated area for sponsor rollups. If you have any questions, please <u><a href="mailto:${contact.email}">contact us</a></u>.`,
      },
      {
        question: 'Do you provide a list of attendees?',
        answer: `No, we do not provide a list of attendees. However, we encourage you to network with the attendees during the conference and afterparty.`,
      }
    ],
  },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Info() {
  return (
    <Layout>
      <div className="bg-white">
        {faqs.map((section) => (
          <div key={section.anchor} id={section.anchor}>
            <div className="mx-auto max-w-7xl px-6 py-24 sm:pt-32 lg:px-8 lg:py-40">
              <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                <div className="lg:col-span-5">
                  <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">{section.heading}</h2>
                  <p className="mt-4 text-base leading-7 text-gray-600">
                    {section.description}
                  </p>
                </div>
                <div className="mt-10 lg:col-span-7 lg:mt-0">
                  <dl className="space-y-10">
                    {section.questions.map((faq) => (
                      <div key={faq.question}>
                        <dt className="text-base font-semibold leading-7 text-gray-900">{faq.question}</dt>
                        <dd className="mt-2 text-base leading-7 text-gray-600" dangerouslySetInnerHTML={{ __html: faq.answer }}></dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
}
