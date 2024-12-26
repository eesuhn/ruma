import { EventData } from '@/types/state';

type EventDataWithStatus = EventData & {
  registrationStatus?: 'pending' | 'going' | 'checked-in' | 'rejected';
  showManage?: boolean;
};

export const UPCOMING_EVENTS: EventDataWithStatus[] = [
  {
    isPublic: true,
    needsApproval: false,
    name: 'Superteam',
    image: '/sample/event-cover2.png',
    capacity: 100,
    startTimestamp: 1735286400,
    endTimestamp: 1735300800,
    location: 'Sunway University',
    about: 'Superteam',
    registrationStatus: 'going',
  },
  {
    isPublic: true,
    needsApproval: false,
    name: 'Lorem ipsum',
    image: '/sample/event-cover2.png',
    capacity: 50,
    startTimestamp: 1729454400, // Oct 20, 2024 7:00pm
    endTimestamp: 1729465200,
    location: 'Sunway University',
    about: 'Lorem ipsum event',
  },
  {
    isPublic: true,
    needsApproval: true,
    name: 'Organizer Event',
    image: '/sample/event-cover2.png',
    capacity: 200,
    startTimestamp: 1733116800, // Dec 1, 2024 2:00pm
    endTimestamp: 1733127600,
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
