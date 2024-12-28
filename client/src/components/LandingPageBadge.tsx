'use client';

import { getMetadataAcc, getMetadataPda } from '@/actions/umi';
import { useAnchorProgram } from '@/hooks/useAnchorProgram';
import { Event } from '@/types/idlAccounts';
import { ProgramAccount } from '@coral-xyz/anchor';
import Image from 'next/image';
import { useState } from 'react';
import useSWR from 'swr';

type RandomBadge = {
  name: string;
  uri: string;
};

export function LandingPageBadge() {
  const { getAllEventAcc } = useAnchorProgram();
  const [randomBadge, setRandomBadge] = useState<RandomBadge>({
    name: '/sample/landing-hero.jpg',
    uri: 'Default Landing Badge',
  });
  const { data: events, error: eventError } = useSWR(getAllEventAcc);
  const { data: metadataAcc, error: metadataError } = useSWR(
    events,
    async (events: ProgramAccount<Event>[]) => {
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      const metadataPda = await getMetadataPda(randomEvent.account.data.image);
      return await getMetadataAcc(metadataPda);
    }
  );

  if (eventError) {
    console.error(eventError);
  }

  if (metadataError) {
    console.error(metadataError);
  }

  if (metadataAcc) {
    setRandomBadge({ name: metadataAcc.name, uri: metadataAcc.uri });
  }

  return (
    <Image
      src={randomBadge.uri}
      alt={randomBadge.name}
      fill
      className="rounded-3xl object-cover shadow-xl"
      priority
    />
  );
}
