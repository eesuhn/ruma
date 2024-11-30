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
import { events } from '@/samples/discoverData';
import { EventCard } from '@/components/EventCard';
export default function DiscoverPage() {
  return (
    <div className="py-20 px-10">
      <h1 className="text-3xl font-bold ml-20">Discover Events</h1>
      <div className=" grid grid-cols-2 justify-self-center p-4 gap-8 w-[70%]">
        {events.map((event) => (
          <EventCard key={event.id} {...event} />
        ))}
      </div>
    </div>
  );
}