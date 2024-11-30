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

export default function Page() {
  return (
    <div className="grid grid-cols-1 gap-x-32 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event, index) => (
        <Card key={index} className="w-full max-w-lg">
          <CardHeader>
            <Image
              src={event.event_img}
              alt={event.title}
              height={200}
              width={300}
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
