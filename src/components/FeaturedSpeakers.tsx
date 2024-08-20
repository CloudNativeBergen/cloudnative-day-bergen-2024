import { getFeatured } from "@/lib/speaker/sanity"
import { Container } from "@/components/Container"
import { iconForLink } from "@/components/SocialIcons"

export async function FeaturedSpeakers() {
  const data = await getFeatured()

  return (
    <section
      id="speakers"
      aria-labelledby="speakers-title"
      className="py-20 sm:py-32"
    >

      <Container>
        <div className="bg-white py-32">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2
              id="speakers-title"
              className="font-display text-4xl font-medium tracking-tighter text-blue-600 sm:text-5xl"
            >
              Some of our speakers
            </h2>
            <p className="mt-4 font-display text-2xl tracking-tight text-blue-900">
              Meet some of our amazing speakers that will be joining us at the conference and sharing their knowledge with you.
            </p>
          </div>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <ul
              role="list"
              className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 text-center"
            >
              {data.speakers.map((person) => (
                <li key={person.name}>
                  <a href={`/speaker/${person.slug}`}>
                    <img className="mx-auto h-56 w-56 rounded-full" src={person.image} alt="" />
                    <h3 className="mt-6 text-2xl font-semibold leading-7 tracking-tight text-gray-900">{person.name}</h3>
                  </a>
                  <p className="text-l leading-6 text-gray-600">{person.title}</p>
                  <ul role="list" className="mt-6 flex justify-center gap-x-6">
                    {person.links?.map((link) => (
                      <li key={person.name}>
                        <a href={link} className="text-gray-400 hover:text-gray-500">
                          {iconForLink(link)}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container >
    </section >
  )
}
