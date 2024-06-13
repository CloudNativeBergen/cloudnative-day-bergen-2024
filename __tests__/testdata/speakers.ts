import { Flags, Speaker } from "@/lib/speaker/types";

const speakers: Speaker[] = [
  {
    _id: '92a2ad7c-d831-48e2-aff1-ff81f9561388',
    name: 'John Doe',
    title: 'Acme Inc.',
    email: 'john@acme.com',
    flags: [Flags.localSpeaker, Flags.firstTimeSpeaker]
  },
  {
    _id: 'c3a7f9e0-9e8d-4e4b-9e8f-2a4b6d8f9e8d',
    name: 'Alice Smith',
    title: 'XYZ Corp.',
    email: 'alice@xyz.com',
    flags: []
  },
  {
    _id: '08913fe1-4e52-43b9-8b27-6d5febf95dbd',
    name: 'Jane Doe',
    title: 'Acme Inc.',
    email: 'jane@acme.com',
    flags: [Flags.diverseSpeaker, Flags.requiresTravelFunding],
    is_organizer: true
  }
] as Speaker[];

export default speakers;