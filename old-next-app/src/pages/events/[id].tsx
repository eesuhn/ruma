import { useRouter } from 'next/router';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IoCalendarOutline } from 'react-icons/io5';
import { IoLocationOutline } from 'react-icons/io5';

interface Event {
  id: number;
  title: string;
  event_img: string;
  venue: string;
  address: string;
  time: number; // Assuming time is in 24-hour format, e.g., 1300 for 1:00 PM
  date: Date;
  description: string;
  organizer: string;
  organizerimg: string;
}

const events: Event[] = [
  {
    id: 1,
    title: 'Community Meetup',
    event_img: '/event1.png', // Example image path
    venue: 'Tech Conference Center',
    address: '123, orchard road, merlion den',
    time: 1400,
    date: new Date('2024-12-12'),
    description: 'test123',
    organizer: 'gdsc_logo',
    organizerimg: '/gdsc_logo.png',
  },
  {
    id: 2,
    title: 'Annual Tech Summit',
    event_img: '/images/event2.jpg',
    venue: 'Innovation Hub',
    address: '123, orchard road, merlion den',
    time: 900,
    date: new Date('2024-11-05'),
    description: 'test123',
    organizer: 'stc',
    organizerimg: '/gdsc_logo.png',
  },
  {
    id: 3,
    title: 'Startup Pitch Night',
    event_img: '/images/event3.jpg',
    venue: 'Entrepreneurship Lounge',
    address: '123, orchard road, merlion den',
    time: 1830,
    date: new Date('2024-10-25'),
    description: 'test123',
    organizer: 'stc',
    organizerimg: '/gdsc_logo.png',
  },
  {
    id: 4,
    title: 'Startup Pitch Night',
    event_img: '/images/event3.jpg',
    venue: 'Entrepreneurship Lounge',
    address: '123, orchard road, merlion den',
    time: 1830,
    date: new Date('2024-10-25'),
    description: 'test123',
    organizer: 'stc',
    organizerimg: '/gdsc_logo.png',
  },
  {
    id: 5,
    title: 'Startup Pitch Night',
    event_img: '/images/event3.jpg',
    venue: 'Entrepreneurship Lounge',
    address: '123, orchard road, merlion den',
    time: 1830,
    date: new Date('2024-10-25'),
    description: 'test123',
    organizer: 'stc',
    organizerimg: '/gdsc_logo.png',
  },
  {
    id: 6,
    title: 'Startup Pitch Night',
    event_img: '/images/event3.jpg',
    venue: 'Entrepreneurship Lounge',
    address: '123, orchard road, merlion den',
    description: 'test123',
    organizer: 'stc',
    time: 1830,
    date: new Date('2024-10-25'),
    organizerimg: '/gdsc_logo.png',
  },
  {
    id: 7,
    title: 'Startup Pitch Night',
    event_img: '/images/event3.jpg',
    venue: 'Entrepreneurship Lounge',
    address: '123, orchard road, merlion den',
    description: 'test123',
    time: 1830,
    date: new Date('2024-10-25'),
    organizer: 'stc',
    organizerimg: '/gdsc_logo.png',
  },
];

export default function EventDetail() {
  const router = useRouter();
  const { id } = router.query;

  const event = events[Number(id)];

  if (!event) {
    return <p>Loading....</p>;
  }

  return (
    <div className="flex flex-row">
      <div>
        <img
          src={event.event_img}
          alt={event.title}
          className="mb-2 h-80 w-full object-contain"
        />
        <p className="text-[14px] font-bold">Hosted by:</p>
        <div className="ml-2 flex flex-row items-center">
          <Avatar className="mr-2 h-12 w-12">
            <AvatarImage src={event.organizerimg} alt={event.organizer} />
            <AvatarFallback>{event.organizer}</AvatarFallback>
          </Avatar>
          <p className="text-[18px] font-semibold">{event.organizer}</p>
        </div>
      </div>
      <div className="w-[600px] p-8">
        <h1 className="mb-4 text-4xl font-bold">{event.title}</h1>
        <div className="mb-2 ml-4 flex flex-row items-center">
          <IoCalendarOutline className="mr-3 text-[35px]" />
          <div className="leading-6">
            <p className="text-[24px] font-semibold">
              {event.date.toDateString()}
            </p>
            <p className="text-[16px] font-light">{event.time}</p>
          </div>
        </div>
        <div className="mb-2 ml-4 flex flex-row items-center">
          <IoLocationOutline className="mr-3 text-[35px]" />
          <div className="leading-6">
            <p className="text-[24px] font-semibold">{event.venue}</p>
            <p className="text-[16px] font-light">{event.address}</p>
          </div>
        </div>

        <div className="mb-2 rounded-lg p-4 shadow-lg">
          <div className="rounded-t-lg bg-[#545454]/10">
            <p className="p-2 font-semibold">Registration</p>
          </div>
          <p className="my-2 p-2">
            Welcome! To join the event, please register below.
          </p>
          <div className="w-[60%] justify-self-center rounded-xl bg-[#00A9DD] p-2 text-center hover:scale-105 hover:cursor-pointer hover:bg-blue-500">
            <p className="font-semibold text-white">Request to join!</p>
          </div>
        </div>
        <p className="font-semibold">About Event:</p>
        <p>{event.description}</p>
      </div>
    </div>
  );
}
