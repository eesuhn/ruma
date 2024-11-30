export interface EventDetails {
  id: number;
  title: string;
  event_img: string;
  venue: string;
  address: string;
  time: number;
  date: Date;
  description: string;
  organizer: string;
  organizerimg: string;
}

export const events: EventDetails[] = [
  {
    id: 1,
    title: 'Community Meetup',
    event_img: '/sample/sample-event.png',
    venue: 'Tech Conference Center',
    address: '123, orchard road, merlion den',
    time: 1400,
    date: new Date('2024-12-12'),
    description: 'test123',
    organizer: 'gdsc_logo',
    organizerimg: '/sample/organizer-logo.png',
  },
  {
    id: 2,
    title: 'Annual Tech Summit',
    event_img: '/sample/sample-event.png',
    venue: 'Innovation Hub',
    address: '123, orchard road, merlion den',
    time: 900,
    date: new Date('2024-11-05'),
    description: 'test123',
    organizer: 'stc',
    organizerimg: '/sample/organizer-logo.png',
  },
  {
    id: 3,
    title: 'Startup Pitch Night',
    event_img: '/sample/sample-event.png',
    venue: 'Entrepreneurship Lounge',
    address: '123, orchard road, merlion den',
    time: 1830,
    date: new Date('2024-10-25'),
    description: 'test123',
    organizer: 'stc',
    organizerimg: '/sample/organizer-logo.png',
  },
  {
    id: 4,
    title: 'Startup Pitch Night',
    event_img: '/sample/sample-event.png',
    venue: 'Entrepreneurship Lounge',
    address: '123, orchard road, merlion den',
    time: 1830,
    date: new Date('2024-10-25'),
    description: 'test123',
    organizer: 'stc',
    organizerimg: '/sample/organizer-logo.png',
  },
  {
    id: 5,
    title: 'Startup Pitch Night',
    event_img: '/sample/sample-event.png',
    venue: 'Entrepreneurship Lounge',
    address: '123, orchard road, merlion den',
    time: 1830,
    date: new Date('2024-10-25'),
    description: 'test123',
    organizer: 'stc',
    organizerimg: '/sample/organizer-logo.png',
  },
  {
    id: 6,
    title: 'Startup Pitch Night',
    event_img: '/sample/sample-event.png',
    venue: 'Entrepreneurship Lounge',
    address: '123, orchard road, merlion den',
    description: 'test123',
    organizer: 'stc',
    time: 1830,
    date: new Date('2024-10-25'),
    organizerimg: '/sample/organizer-logo.png',
  },
  {
    id: 7,
    title: 'Startup Pitch Night',
    event_img: '/sample/sample-event.png',
    venue: 'Entrepreneurship Lounge',
    address: '123, orchard road, merlion den',
    description: 'test123',
    time: 1830,
    date: new Date('2024-10-25'),
    organizer: 'stc',
    organizerimg: '/sample/organizer-logo.png',
  },
];
