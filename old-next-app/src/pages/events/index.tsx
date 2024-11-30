import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FiCalendar } from 'react-icons/fi';
import { GrLocation } from 'react-icons/gr';

interface Event {
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

export default function eventpage() {
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

  return (
    <div className="grid grid-cols-1 gap-x-32 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event, index) => (
        <Card key={index} className="w-full max-w-lg">
          <CardHeader>
            <img
              src={event.event_img}
              alt={event.title}
              className="h-48 w-full object-contain"
            />
            <CardTitle className="mt-4 text-2xl">{event.title}</CardTitle>
            <div className="flex flex-row items-center">
              <Avatar className="mr-2 h-8 w-8">
                <AvatarImage src={event.organizerimg} alt={event.organizer} />
                <AvatarFallback>{event.organizer}</AvatarFallback>
              </Avatar>
              <CardDescription>By {event.organizer}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="">
              <div className="mb-2 flex flex-row items-center">
                <FiCalendar className="mr-2 h-6 w-6 text-[#737373]" />
                <p className="font-medium text-[#737373]">
                  {' '}
                  {event.date.toDateString()}
                </p>
              </div>

              <div className="flex flex-row items-center">
                <GrLocation className="mr-2 h-6 w-6 text-[#737373]" />
                <p className="font-medium text-[#737373]"> {event.venue}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="place-self-center">
            {/* You can add more actions or buttons in the footer */}
            <Link href={`/events/${index}`}>
              <div className="group cursor-pointer rounded-md bg-blue-200 px-4 py-2 hover:scale-105 hover:bg-blue-400">
                <div className="block font-semibold text-[#444444] group-hover:text-white">
                  View Details
                </div>
              </div>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
