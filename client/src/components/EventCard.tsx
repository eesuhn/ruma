import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CalendarIcon, Clock, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EventData } from '@/types/state';

const getBadgeVariant = (status?: string) => {
  switch (status) {
    case 'pending':
      return 'bg-[#f77f00]';
    case 'going':
      return 'bg-[#79be79]';
    case 'checked-in':
      return 'bg-[#91d1ce]';
    case 'rejected':
      return 'bg-[#e5383b]';
    default:
      return 'bg-black';
  }
};

interface EventCardProps extends EventData {
  registrationStatus?: 'pending' | 'going' | 'checked-in' | 'rejected';
  showManage?: boolean;
}

export function EventCard({
  name,
  image,
  startTimestamp,
  location,
  registrationStatus,
  showManage,
}: EventCardProps) {
  const getButtonContent = () => {
    if (registrationStatus) {
      const badgeColor = getBadgeVariant(registrationStatus);
      const badgeName =
        registrationStatus.charAt(0).toUpperCase() +
        registrationStatus.slice(1);
      return (
        <Badge
          className={`${badgeColor} hover:${badgeColor} inline-block rounded-full px-3 py-1 text-sm font-semibold`}
        >
          {badgeName}
        </Badge>
      );
    }
    if (showManage) {
      return (
        <Button size="sm" className="h-9">
          Manage Event
          <ArrowRight className="h-4 w-4" />
        </Button>
      );
    }
  };

  return (
    <Link href={showManage ? `/events/${name}/manage` : `/events/${name}`}>
      <Card className="mb-2 overflow-hidden transition-shadow hover:shadow-lg">
        <div className="grid gap-4 p-4 md:grid-cols-[1fr,200px]">
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">{name}</h3>
            <div className="ml-1 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <span>
                  {new Date(startTimestamp || 0).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  {new Date(startTimestamp || 0).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{location || 'TBA'}</span>
              </div>
            </div>
            {getButtonContent()}
          </div>
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={image}
              alt={name}
              fill
              className="rounded-lg object-cover"
            />
          </div>
        </div>
      </Card>
    </Link>
  );
}
