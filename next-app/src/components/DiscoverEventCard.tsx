import Image from 'next/image';
import Link from 'next/link';

interface DiscoverEventCardProps {
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

export function DiscoverEventCard({
  id,
  title,
  date,
  address,
  event_img,
}: DiscoverEventCardProps) {
  return (
    <div className="rounded-lg bg-[#F6F6F6] p-4 shadow-lg ease-in-out hover:bg-slate-300">
      <Link href={`/events/${id}`} className="group flex gap-6">
        <div className="relative h-[120px] w-[120px] flex-shrink-0 overflow-hidden rounded-lg">
          <Image src={event_img} alt={title} fill className="object-cover" />
        </div>
        <div className="flex flex-col justify-center">
          <h3 className="text-lg font-semibold transition-colors group-hover:text-gray-600">
            {title}
          </h3>
          <p className="mt-1 text-gray-500">{date.toDateString()}</p>
          <p className="text-gray-500">{address}</p>
        </div>
      </Link>
    </div>
  );
}
