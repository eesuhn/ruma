'use client';

import Image from 'next/image';
import { CalendarIcon, Clock, MapPin } from 'lucide-react';
import { EventData } from '@/types/state';
import {
  EventStatusType,
  getEventStatusDetails,
  getNftStatusContent,
} from './action';
import { useRouter } from 'next/navigation';

interface EventDetails extends EventData {
  statusType: EventStatusType;
  nft: {
    image: string;
    title: string;
    symbol: string;
  };
}

const eventDetailsSample: EventDetails = {
  isPublic: true,
  needsApproval: false,
  name: 'SuperteamMY Meetup #24',
  image: '/sample/event-cover2.png',
  capacity: 100,
  startTimestamp: 1637385600,
  endTimestamp: 1637400000,
  location: 'Sunway University',
  about:
    'Lorem ipsum dolor sit amet consectetur. Mattis sed viverra nunc rutrum. Et neque suscipit sagittis maecenas. Posuere fermentum pulvinar amet placer',
  statusType: 'organizer',
  nft: {
    image: '/sample/nft.svg',
    title: 'Chill Guy',
    symbol: 'CHG',
  },
};

export default function Page({ params }: { params: { id: string } }) {
  void params;
  const router = useRouter();

  const getButtonContent = () => {
    const { button, badge } = getEventStatusDetails(
      eventDetailsSample.statusType,
      () => router.push(`/events/${eventDetailsSample.name}/manage`), // TODO: Update this to event ID
      () => console.log('Register for event'),
      () => console.log('Check in')
    );
    return (
      <div className="flex w-full items-center">
        <div className="flex-1">{button}</div>
        <div>{badge}</div>
      </div>
    );
  };

  return (
    <div className="container mx-auto max-w-5xl space-y-8 px-40 py-8">
      <div className="grid gap-8 md:grid-cols-[1fr,2fr]">
        <div className="space-y-6">
          <div className="relative aspect-square w-full">
            <Image
              src={eventDetailsSample.image}
              alt={eventDetailsSample.name}
              fill
              className="rounded-lg object-cover"
            />
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <h1 className="mb-4 text-3xl font-bold">
              {eventDetailsSample.name}
            </h1>
            <div className="ml-1 space-y-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                {eventDetailsSample.startTimestamp ? (
                  <span>
                    {new Date(
                      eventDetailsSample.startTimestamp * 1000
                    ).toLocaleDateString()}
                  </span>
                ) : (
                  <span>Not available</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  {eventDetailsSample.startTimestamp &&
                  eventDetailsSample.endTimestamp
                    ? `${new Date(eventDetailsSample.startTimestamp * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })} to ${new Date(eventDetailsSample.endTimestamp * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}`
                    : 'Time not available'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{eventDetailsSample.location}</span>
              </div>
            </div>
          </div>

          {getButtonContent()}

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">About</h2>
            <p className="ml-[1px] text-justify text-muted-foreground">
              {eventDetailsSample.about}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4 rounded-lg">
              <div className="relative flex h-24 w-24">
                <Image
                  src={eventDetailsSample.nft.image}
                  alt="NFT Badge"
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
              <div>
                {getNftStatusContent(
                  eventDetailsSample.statusType,
                  eventDetailsSample.nft.title,
                  eventDetailsSample.nft.symbol
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
