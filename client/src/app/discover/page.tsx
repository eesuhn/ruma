import { getAllEventAcc } from '@/actions/program';
import { DiscoverEventCard } from '@/components/';
import { Event } from '@/types/state';
import { ProgramAccount } from '@coral-xyz/anchor';
import { useEffect, useState } from 'react';

export default function Page() {
  const [events, setEvents] = useState<ProgramAccount<Event>[]>([]);

  useEffect(() => {
    (async () => {
      const events = await getAllEventAcc();
      setEvents(events);
    })()
  }, []);

  return (
    <div className="mb-6 mt-2 px-72">
      <h1 className="mb-4 text-3xl font-bold">Discover Events</h1>
      <div className="grid w-full grid-cols-2 gap-8 justify-self-center">
        {events.map(({ publicKey, account }) => (
          <DiscoverEventCard
            key={publicKey.toBase58()}
            eventPda={publicKey}
            name={account.data.name}
            image={account.data.image}
            startTimestamp={account.data.startTimestamp}
            location={account.data.location}
          />
        ))}
      </div>
    </div>
  );
}
