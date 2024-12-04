'use client';

import Image from 'next/image';
import { CalendarIcon, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Page({ params }: { params: { id: string } }) {
  console.log(params);
  const router = useRouter();

  // SAMPLE
  const eventDetailsSample = {
    id: '1',
    title: 'SuperteamMY Meetup #24',
    date: 'Wednesday, November 20',
    time: '12:00 PM - 4:00 PM',
    location: 'Sunway University',
    image: '/sample/event-cover2.png',
    description:
      'Lorem ipsum dolor sit amet consectetur. Mattis sed viverra nunc rutrum. Et neque suscipit sagittis maecenas. Posuere fermentum pulvinar amet placerat eu metus feugiat pretium. Ut sit elementum dignissim dolor hendrerit lectus posuere justo.',
    condition: 'registered',
    registrationStatus: 'going',
    nft: {
      image: '/sample/nft.svg',
      title: 'Event Attendee',
      symbol: 'EVT',
    },
  };

  const getButtonContent = () => {
    switch (eventDetailsSample.condition) {
      case 'registered':
        return (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => console.log('Check in')}
          >
            Check in
          </Button>
        );
      case 'register':
        return (
          <Button
            className="w-full"
            onClick={() => console.log('Register for event')}
          >
            Register for Event
          </Button>
        );
      case 'manage':
        return (
          <Button
            className="w-full"
            onClick={() =>
              router.push(`/events/${eventDetailsSample.id}/manage`)
            }
          >
            Manage Event
          </Button>
        );
    }
  };

  const getNFTContent = () => {
    switch (eventDetailsSample.condition) {
      case 'register':
        return (
          <div className="text-center">
            <h3 className="mb-2 font-semibold">
              {eventDetailsSample.nft.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {eventDetailsSample.nft.symbol}
            </p>
          </div>
        );
      case 'registered':
        return (
          <p className="text-center font-medium">
            Earn this badge when you check in this event!
          </p>
        );
      case 'checked-in':
        return (
          <p className="text-center font-medium text-green-600">
            Badge earned!
          </p>
        );
    }
  };

  return (
    <div className="container mx-auto max-w-6xl space-y-8 py-8">
      <div className="grid gap-8 md:grid-cols-[1fr,2fr]">
        <div className="space-y-6">
          <div className="relative aspect-square w-full">
            <Image
              src={eventDetailsSample.image}
              alt={eventDetailsSample.title}
              fill
              className="rounded-lg object-cover"
            />
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <h1 className="mb-4 text-3xl font-bold">
              {eventDetailsSample.title}
            </h1>
            <div className="space-y-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <span>{eventDetailsSample.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{eventDetailsSample.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{eventDetailsSample.location}</span>
              </div>
            </div>
          </div>

          {getButtonContent()}

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">About</h2>
            <p className="text-muted-foreground">
              {eventDetailsSample.description}
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">NFT Badge</h2>
            <div className="flex items-center space-x-4 rounded-lg bg-muted p-4">
              <div className="relative h-20 w-20 flex-shrink-0">
                <Image
                  src={eventDetailsSample.nft.image}
                  alt="NFT Badge"
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
              <div className="flex-grow">{getNFTContent()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
