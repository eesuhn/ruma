import { events } from '@/samples/discoverData';
import { EventCard } from '@/components/EventCard';

export default function Page() {
  return (
    <div className="px-10 mb-6">
      <h1 className="ml-20 text-3xl font-bold">Discover Events</h1>
      <div className="grid w-[70%] grid-cols-2 gap-8 justify-self-center p-4">
        {events.map((event) => (
          <EventCard key={event.id} {...event} />
        ))}
      </div>
    </div>
  );
}
