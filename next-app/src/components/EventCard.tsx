import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
interface EventCardProps {
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

export function EventCard({ id, title, description, date, address, event_img }: EventCardProps) {
  return (
    <div className='shadow-lg p-4 rounded-lg bg-[#F6F6F6] hover:bg-slate-300 ease-in-out '>
        <Link href="#" className="flex gap-6 group ">
        <div className="relative w-[120px] h-[120px] rounded-lg overflow-hidden flex-shrink-0">
            <Image
            src={event_img}
            alt={title}
            fill
            className="object-cover"
            />
        </div>
        <div className="flex flex-col justify-center">
            <h3 className="text-lg font-semibold group-hover:text-gray-600 transition-colors">
            {title}
            </h3>
            <p className="text-gray-500 mt-1">{date.toDateString()}</p>
            <p className="text-gray-500">{address}</p>
        </div>
        </Link>
    </div>

  );
}

