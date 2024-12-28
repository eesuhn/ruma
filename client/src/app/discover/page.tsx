'use client';

import { DiscoverEventCard } from '@/components/DiscoverEventCard';
import { useAnchorProgram } from '@/hooks/useAnchorProgram';
import { Event } from '@/types/idlAccounts';
import { ProgramAccount } from '@coral-xyz/anchor';
import { useEffect, useState } from 'react';

export default function Page() {
  const { getAllEventAcc } = useAnchorProgram();
  const [events, setEvents] = useState<ProgramAccount<Event>[]>([]);

  useEffect(() => {
    (async () => {
      const events = await getAllEventAcc();
      setEvents(events);
    })();
  }, [getAllEventAcc]);

  return (
    <div className="mb-6 mt-2 px-72">
      <h1 className="mb-4 text-3xl font-bold">Discover Events</h1>
      <div className="grid w-full grid-cols-2 gap-8 justify-self-center">
        {events.map((event) => (
          <DiscoverEventCard key={event.name} {...event} />
        ))}
      </div>
    </div>
  );
}
