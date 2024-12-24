import { events } from '@/samples/discoverData';
import { DiscoverEventCard } from '@/components/DiscoverEventCard';

export default function Page() {
  return (
    <div className="mb-6 mt-2 px-72">
      <h1 className="mb-4 text-3xl font-bold">Discover Events</h1>
      <div className="grid w-full grid-cols-2 gap-8 justify-self-center">
        {events.map((event) => (
          <DiscoverEventCard key={event.bump} {...event} />
        ))}
      </div>
    </div>
  );
}
