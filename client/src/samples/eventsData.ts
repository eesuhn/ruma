import { EventData } from '@/types/state';

type EventDataWithStatus = EventData & {
  registrationStatus?: 'pending' | 'going' | 'checked-in' | 'rejected';
  showManage?: boolean;
};

export const UPCOMING_EVENTS: EventDataWithStatus[] = [
  {
    isPublic: true,
    needsApproval: false,
    name: 'SuperteamMY Meetup #24',
    image: '/sample/event-cover2.png',
    capacity: 100,
    startTimestamp: 1732132800000, // Nov 20, 2024 12:00pm
    endTimestamp: 1732144400000,
    location: 'Sunway University',
    about: 'SuperteamMY Meetup #24',
    registrationStatus: 'going',
  },
  {
    isPublic: true,
    needsApproval: false,
    name: 'Lorem ipsum',
    image: '/sample/event-cover2.png',
    capacity: 50,
    startTimestamp: 1729454400000, // Oct 20, 2024 7:00pm
    endTimestamp: 1729465200000,
    location: 'Sunway University',
    about: 'Lorem ipsum event',
  },
  {
    isPublic: true,
    needsApproval: true,
    name: 'Organizer Event',
    image: '/sample/event-cover2.png',
    capacity: 200,
    startTimestamp: 1733116800000, // Dec 1, 2024 2:00pm
    endTimestamp: 1733127600000,
    location: 'Virtual',
    about: 'Organizer event',
    showManage: true,
  },
] as const;

export const PAST_EVENTS: EventDataWithStatus[] = [
  {
    isPublic: true,
    needsApproval: false,
    name: 'Lorem ipsum',
    image: '/sample/event-cover2.png',
    capacity: 75,
    startTimestamp: 1729454400000, // Oct 20, 2024 7:00pm
    endTimestamp: 1729465200000,
    location: 'Sunway University',
    about: 'Past Lorem ipsum event',
    registrationStatus: 'checked-in',
  },
] as const;
