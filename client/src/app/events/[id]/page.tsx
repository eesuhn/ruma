'use client';

import Image from 'next/image';
import {
  ArrowRight,
  CalendarIcon,
  Clock,
  MapPin,
  QrCode,
  Ticket,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
import { useAnchorProgram } from '@/hooks/useAnchorProgram';
import { PublicKey } from '@solana/web3.js';
import { EventStatus, RegistrationStatus } from '@/types/event';
import { capitalizeFirstLetter } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { getUserPda } from '@/lib/pda';
import { Event } from '@/types/idlAccounts';
import { getMetadataAcc, getMetadataPda } from '@/lib/umi';

function EventStatusDetailsButton({
  onClick,
  Icon,
  text,
  disabled,
}: {
  onClick?: () => void;
  Icon: FC<React.SVGProps<SVGSVGElement>>;
  text?: string;
  disabled?: boolean;
}) {
  return (
    <Button className="h-8" onClick={onClick} disabled={disabled}>
      {text}
      <Icon className="h-4 w-4" />
    </Button>
  );
}

function EventStatusDetailsBadge({ status }: { status: RegistrationStatus }) {
  return (
    <Badge className={`bg-status-${status} text-white`}>
      {capitalizeFirstLetter(status)}
    </Badge>
  );
}

function EventStatusDetails({
  status,
  onManageClick,
  onRegisterClick,
  onCheckInClick,
}: {
  status: EventStatus;
  onManageClick?: () => void;
  onRegisterClick?: () => void;
  onCheckInClick?: () => void;
}) {
  return (
    <div className="flex w-full items-center">
      <div className="flex-1">
        {!['checked-in', 'rejected'].includes(status) && (
          <EventStatusDetailsButton
            onClick={
              status === 'organizer'
                ? onManageClick
                : status === 'not-registered'
                  ? onRegisterClick
                  : onCheckInClick
            }
            Icon={
              status === 'organizer'
                ? ArrowRight
                : status === 'not-registered'
                  ? Ticket
                  : QrCode
            }
            text={
              status === 'organizer'
                ? 'Manage Event'
                : status === 'not-registered'
                  ? 'Register for Event'
                  : ['pending', 'checked-in'].includes(status)
                    ? 'Check-in'
                    : ''
            }
          />
        )}
      </div>
      <div>
        {!['organizer', 'not-registered'].includes(status) && (
          <EventStatusDetailsBadge
            status={
              status === 'pending'
                ? 'pending'
                : status === 'event-not-started'
                  ? 'approved'
                  : status === 'not-checked-in'
                    ? 'approved'
                    : status === 'checked-in'
                      ? 'checked-in'
                      : 'rejected'
            }
          />
        )}
      </div>
    </div>
  );
}

function EventBadge({
  status,
  title,
  symbol,
}: {
  status: EventStatus;
  title: string;
  symbol: string;
}) {
  return (
    <div className="ml-2">
      <h3 className="mb-1 font-semibold">{title}</h3>
      <p className="ml-[1px] text-left text-sm text-muted-foreground">
        {['organizer', 'not-registered', 'pending', 'rejected'].includes(status)
          ? symbol
          : ['event-not-started', 'not-checked-in'].includes(status)
            ? 'Earn this badge when you check into this event!'
            : 'Badge earned!'}
      </p>
    </div>
  );
}

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { publicKey } = useWallet();
  const { getEventAcc, getAttendeeAcc } = useAnchorProgram();
  const {
    data: event,
    isLoading,
    error: eventError,
  } = useSWR(`/events/${id}`, (id) => getEventAcc(new PublicKey(id)));
  const { data: eventBadge, error: badgeError } = useSWR(
    event,
    async (event) => {
      const metadataPda = getMetadataPda(event.badge!);
      return await getMetadataAcc(metadataPda);
    }
  );
  const { data: status = 'not-registered' } = useSWR(
    [event, publicKey],
    async (event: Event, publicKey: PublicKey) => {
      const userPda = getUserPda(publicKey);

      let status: EventStatus = 'not-registered';

      if (event.organizer.equals(userPda)) {
        status = 'organizer';
        return status;
      }

      for (const attendeePda of event.attendees) {
        const attendeeAcc = await getAttendeeAcc(attendeePda);

        if (!attendeeAcc) {
          status = 'not-registered';
          break;
        }

        if (attendeeAcc.user.equals(userPda)) {
          if (attendeeAcc.status.pending) {
            status = 'pending';
          } else if (attendeeAcc.status.rejected) {
            status = 'rejected';
          } else if (attendeeAcc.status.approved) {
            if (attendeeAcc.status.checkedIn) {
              status = 'checked-in';
            } else if (Number(event.data.startTimestamp) > Date.now()) {
              status = 'not-checked-in';
            } else {
              status = 'event-not-started';
            }
          }
          break;
        }
      }

      return status;
    }
  );

  // TODO: add error and loading states
  if (eventError) return <p>{eventError.message}</p>;
  if (badgeError) return <p>{badgeError.message}</p>;
  if (isLoading) return <p>Loading...</p>;

  return (
    event &&
    eventBadge && (
      <div className="container mx-auto max-w-5xl space-y-8 px-40 py-8">
        <div className="grid gap-8 md:grid-cols-[1fr,2fr]">
          <div className="space-y-6">
            <div className="relative aspect-square w-full">
              <Image
                src={event.data.image}
                alt={event.data.name}
                fill
                className="rounded-lg object-cover"
              />
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h1 className="mb-4 text-3xl font-bold">{event.data.name}</h1>
              <div className="ml-1 space-y-2 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>
                    {Number(event.data.startTimestamp)
                      ? `${new Date(Number(event.data.startTimestamp) * 1000).toLocaleDateString()}`
                      : 'Not available'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    {Number(event.data.startTimestamp) &&
                    Number(event.data.endTimestamp)
                      ? `${new Date(Number(event.data.startTimestamp) * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })} to ${new Date(event.data.endTimestamp * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}`
                      : 'Time not available'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{event.data.location}</span>
                </div>
              </div>
            </div>

            <EventStatusDetails
              status={status}
              onManageClick={() => router.push(`/events/${id}/manage`)}
              onRegisterClick={() => console.log('Register for event')} // TODO: implement registerForEvent
              onCheckInClick={() => console.log('Check in')} // TODO: implement checkIntoEvent
            />

            <div className="space-y-2">
              <h2 className="text-xl font-semibold">About</h2>
              <p className="ml-[1px] text-justify text-muted-foreground">
                {event.data.about}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4 rounded-lg">
                <div className="relative flex h-24 w-24">
                  <Image
                    src={eventBadge.uri}
                    alt="NFT Badge"
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
                <div>
                  <EventBadge
                    status={status}
                    title={eventBadge.name}
                    symbol={eventBadge.symbol}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
