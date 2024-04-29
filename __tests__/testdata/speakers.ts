import { Speaker } from "@/lib/speaker/types";

const spekaers = [
  {
    _id: '1',
    name: 'John Doe',
    title: 'Acme Inc.',
    email: 'john@acme.com',
    is_diverse: false,
    is_first_time: true,
    is_local: true
  },
  {
    _id: '2',
    name: 'Jane Doe',
    title: 'Acme Inc.',
    email: 'jane@acme.com',
    is_diverse: true,
    is_first_time: false,
    is_local: false
  }
] as Speaker[];

export default spekaers;