'use client';

import { DiscoverEventCard } from '@/components/DiscoverEventCard';
import { useAnchorProgram } from '@/hooks/useAnchorProgram';
import useSWR from 'swr';

export default function Page() {
  const { getAllEventAcc } = useAnchorProgram();
  const {
    data: events,
    isLoading,
    error,
  } = useSWR('/discover', getAllEventAcc);

  // TODO: add error and loading states
  if (error) return <p>{error.message}</p>;
  if (isLoading) return <p>Loading...</p>;

  return (
    events && (
      <div className="mb-6 mt-2 px-72">
        <h1 className="mb-4 text-3xl font-bold">Discover Events</h1>
        <div className="grid w-full grid-cols-2 gap-8 justify-self-center">
          {events.map(({ publicKey, account }) => {
            const { data } = account;

            return (
              <DiscoverEventCard
                key={publicKey.toBase58()}
                eventPda={publicKey}
                name={data.name}
                image={data.image}
                startTimestamp={data.startTimestamp}
                location={data.location}
              />
            );
          })}
        </div>
      </div>
    )
  );
}
