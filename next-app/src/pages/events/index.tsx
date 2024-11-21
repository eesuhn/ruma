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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-y-12 gap-x-32">
      {events.map((event, index) => (
        <Card key={index} className="max-w-lg w-full">
          <CardHeader>
            <img
              src={event.event_img}
              alt={event.title}
              className="w-full h-48 object-contain"
            />
            <CardTitle className="text-2xl mt-4">{event.title}</CardTitle>
            <div className="flex flex-row items-center">
              <Avatar className="w-8 h-8 mr-2">
                <AvatarImage src={event.organizerimg} alt={event.organizer} />
                <AvatarFallback>{event.organizer}</AvatarFallback>
              </Avatar>
              <CardDescription>By {event.organizer}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="">
              <div className="flex flex-row items-center mb-2">
                <FiCalendar className="w-6 h-6 mr-2 text-[#737373]" />
                <p className="font-medium text-[#737373]">
                  {' '}
                  {event.date.toDateString()}
                </p>
              </div>

              <div className="flex flex-row items-center">
                <GrLocation className="w-6 h-6 mr-2 text-[#737373]" />
                <p className="font-medium text-[#737373]"> {event.venue}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="place-self-center">
            {/* You can add more actions or buttons in the footer */}
            <Link href={`/events/${index}`}>
              <div className="bg-blue-200 rounded-md hover:bg-blue-400 px-4 py-2 cursor-pointer hover:scale-105 group ">
                <div className="block text-[#444444] group-hover:text-white  font-semibold">
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
