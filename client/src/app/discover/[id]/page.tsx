'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import { IoCalendarOutline, IoLocationOutline } from 'react-icons/io5';
import { events } from '@/samples/discoverData';

export default function Page() {
  const { id } = useParams();

  const event = events[Number(id)];

  if (!event) {
    return <p>Loading....</p>;
  }

  return (
    <div className="flex flex-row">
      <div>
        <Image
          src={event.event_img}
          alt={event.title}
          height={400}
          width={600}
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
