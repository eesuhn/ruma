export const UPCOMING_EVENTS = [
  {
    id: '1',
    title: 'SuperteamMY Meetup #24',
    date: 'Nov 20, 2024',
    time: '12:00pm',
    location: 'Sunway University',
    image: '/sample/event-cover2.png',
    condition: 'registered',
    registrationStatus: 'going',
  },
  {
    id: '2',
    title: 'Lorem ipsum',
    date: 'Oct 20, 2024',
    time: '7:00pm',
    location: 'Sunway University',
    image: '/sample/event-cover2.png',
    condition: 'register',
  },
  {
    id: '3',
    title: 'Organizer Event',
    date: 'Dec 1, 2024',
    time: '2:00pm',
    location: 'Virtual',
    image: '/sample/event-cover2.png',
    condition: 'manage',
  },
] as const;

export const PAST_EVENTS = [
  {
    id: '4',
    title: 'Lorem ipsum',
    date: 'Oct 20, 2024',
    time: '7:00pm',
    location: 'Sunway University',
    image: '/sample/event-cover2.png',
    condition: 'registered',
    registrationStatus: 'checked-in',
  },
] as const;
