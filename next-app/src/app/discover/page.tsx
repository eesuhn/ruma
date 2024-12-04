import { events } from '@/samples/discoverData';
import { DiscoverEventCard } from '@/components/DiscoverEventCard';

export default function Page() {
  return (
    <div className="mb-6 px-10">
      <h1 className="ml-20 text-3xl font-bold">Discover Events</h1>
      <div className="grid w-[70%] grid-cols-2 gap-8 justify-self-center p-4">
        {events.map((event) => (
          <DiscoverEventCard key={event.id} {...event} />
        ))}
      </div>
    </div>
  );
}
