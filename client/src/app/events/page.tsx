'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventCard } from '@/components/EventCard';
import { useAnchorProgram } from '@/hooks/useAnchorProgram';
import { useState } from 'react';
import useSWR from 'swr';
import { useWallet } from '@solana/wallet-adapter-react';
import { getAttendeePda, getUserPda } from '@/lib/pda';
import { DisplayedEvent } from '@/types/event';
import { ProgramAccount } from '@coral-xyz/anchor';
import { Event } from '@/types/idlAccounts';
import { sortEventsByTimestamp } from '@/lib/utils';

export default function Page() {
  const { publicKey } = useWallet();
  const { getAllEventAcc } = useAnchorProgram();
  const { data: registeredEvents, isLoading, error } = useSWR(async () => {
    const userPda = getUserPda(publicKey!);
    const allEvents = await getAllEventAcc();

    const upcoming: DisplayedEvent[] = [];
    const past: DisplayedEvent[] = [];

    allEvents.forEach(async (event) => {
      const { startTimestamp } = event.account.data;
      const isOrganizer = userPda.equals(event.account.organizer);

      if (isOrganizer) {
        if (Number(startTimestamp) > Date.now()) {
          upcoming.push({ event, isOrganizer });
        } else {
          past.push({ event, isOrganizer });
        }

        return;
      } else {
        const attendeePda = getAttendeePda(userPda, event.publicKey);

        if (event.account.attendees.includes(attendeePda)) {
          if (Number(startTimestamp) > Date.now()) {
            upcoming.push({ event, isOrganizer });
          } else {
            past.push({ event, isOrganizer });
          }
        }
      }
    });

    return {
      upcoming: sortEventsByTimestamp(upcoming),
      past: sortEventsByTimestamp(past),
    };
  });
  const [activeTab, setActiveTab] = useState<string>('upcoming');

  // TODO: add error and loading states
  if (error) return <p>{error.message}</p>;
  if (isLoading) return <p>Loading...</p>;

  if (registeredEvents) {
    const { upcoming, past } = registeredEvents;

    return (
      <div className="container mx-auto px-72">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Events</h1>
          <Tabs defaultValue="upcoming" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Tabs value={activeTab}>
          <TabsContent value="upcoming" className="space-y-4">
            {upcoming.map((
              { event, isOrganizer }:
                { event: ProgramAccount<Event>, isOrganizer: boolean }) => (
              <EventCard
                key={event.publicKey.toBase58()}
                name={event.account.data.name}
                image={event.account.data.image}
                startTimestamp={event.account.data.startTimestamp}
                location={event.account.data.location}
                isOrganizer={isOrganizer}
              />
            ))}
          </TabsContent>
          <TabsContent value="past" className="space-y-4">
            {past.map((
              { event, isOrganizer }:
                { event: ProgramAccount<Event>, isOrganizer: boolean }) => (
              <EventCard
                key={event.publicKey.toBase58()}
                name={event.account.data.name}
                image={event.account.data.image}
                startTimestamp={event.account.data.startTimestamp}
                location={event.account.data.location}
                isOrganizer={isOrganizer}
              />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    )
  }
}
