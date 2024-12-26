import { EventData } from '@/types/state';

export const events: EventData[] = [
  {
    isPublic: true,
    needsApproval: false,
    name: 'Sample Event',
    image: '/sample/event-cover1.png',
    capacity: 100,
    startTimestamp: 1672531200,
    endTimestamp: 1672617600,
    location: '123 Event Street, City',
    about: 'This is a sample event description.',
  },
  {
    isPublic: true,
    needsApproval: false,
    name: 'Another Sample Event',
    image: '/sample/event-cover1.png',
    capacity: 50,
    startTimestamp: 1672531200,
    endTimestamp: 1672617600,
    location: '456 Event Street, City',
    about: 'This is another sample event description.',
  },
];
