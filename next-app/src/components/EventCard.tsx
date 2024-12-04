import Link from 'next/link';
import Image from 'next/image';
import { CalendarIcon, Clock, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type EventProps } from '@/types/event';
import { getBadgeVariant } from '@/utils/getBadgeVariant';

export function EventCard({ event }: EventProps) {
  const getButtonContent = () => {
    switch (event.condition) {
      case 'registered':
        return (
          <Badge variant={getBadgeVariant(event.registrationStatus)}>
            {event.registrationStatus}
          </Badge>
        );
      case 'register':
        return (
          <Button variant="secondary" size="sm">
            Register for Event
          </Button>
        );
      case 'manage':
        return (
          <Button variant="secondary" size="sm">
            Manage Event
          </Button>
        );
    }
  };

  return (
    <Link
      href={
        event.condition === 'manage'
          ? `/events/${event.id}/manage`
          : `/events/${event.id}`
      }
    >
      <Card className="overflow-hidden transition-shadow hover:shadow-lg">
        <div className="grid gap-4 p-4 md:grid-cols-[1fr,200px]">
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">{event.title}</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
            </div>
            {getButtonContent()}
          </div>
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="rounded-lg object-cover"
            />
          </div>
        </div>
      </Card>
    </Link>
  );
}
