import { ArrowRight, QrCode, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { statusStyles, formatStatus } from '@/lib/utils';
import { RegistrationStatus } from '@/types/event';

export type EventStatusType =
  | 'organizer'
  | 'not_registered'
  | 'pending_approval'
  | 'approved_not_started'
  | 'ready_for_checkin'
  | 'checked_in'
  | 'rejected';

export interface EventStatusResult {
  button: JSX.Element | null;
  badge: JSX.Element | null;
  registrationStatus?: RegistrationStatus;
}

export function getEventStatusDetails(
  status: EventStatusType,
  onManageClick: () => void,
  onRegisterClick: () => void,
  onCheckInClick: () => void
): EventStatusResult {
  switch (status) {
    case 'organizer':
      return {
        button: (
          <Button className="h-8" onClick={onManageClick}>
            Manage Event
            <ArrowRight className="h-4 w-4" />
          </Button>
        ),
        badge: null,
      };

    case 'not_registered':
      return {
        button: (
          <Button className="h-8" onClick={onRegisterClick}>
            Register for Event
            <Ticket className="h-4 w-4" />
          </Button>
        ),
        badge: null,
      };

    case 'pending_approval':
      return {
        button: (
          <Button className="h-8" disabled>
            Check-in
            <QrCode className="h-4 w-4" />
          </Button>
        ),
        badge: (
          <Badge className={statusStyles.pending}>
            {formatStatus('pending')}
          </Badge>
        ),
        registrationStatus: 'pending',
      };

    case 'approved_not_started':
      return {
        button: (
          <Button className="h-8" disabled>
            Check-in
            <QrCode className="h-4 w-4" />
          </Button>
        ),
        badge: (
          <Badge className={statusStyles.going}>{formatStatus('going')}</Badge>
        ),
        registrationStatus: 'going',
      };

    case 'ready_for_checkin':
      return {
        button: (
          <Button className="h-8" onClick={onCheckInClick}>
            Check-in
            <QrCode className="h-4 w-4" />
          </Button>
        ),
        badge: (
          <Badge className={statusStyles.going}>{formatStatus('going')}</Badge>
        ),
        registrationStatus: 'going',
      };

    case 'checked_in':
      return {
        button: null,
        badge: (
          <Badge className={statusStyles['checked-in']}>
            {formatStatus('checked-in')}
          </Badge>
        ),
        registrationStatus: 'checked-in',
      };

    case 'rejected':
      return {
        button: null,
        badge: (
          <Badge className={statusStyles.rejected}>
            {formatStatus('rejected')}
          </Badge>
        ),
        registrationStatus: 'rejected',
      };
  }
}

export function getNftStatusContent(
  status: EventStatusType,
  title: string,
  symbol: string
) {
  switch (status) {
    case 'organizer':
    case 'not_registered':
    case 'pending_approval':
    case 'rejected':
      return (
        <div className="ml-2">
          <h3 className="mb-1 font-semibold">{title}</h3>
          <p className="ml-[1px] text-left text-sm text-muted-foreground">
            {symbol}
          </p>
        </div>
      );

    case 'approved_not_started':
    case 'ready_for_checkin':
      return (
        <div className="ml-2">
          <h3 className="mb-1 font-semibold">{title}</h3>
          <p className="ml-[1px] text-left text-sm text-muted-foreground">
            Earn this badge when you check into this event!
          </p>
        </div>
      );

    case 'checked_in':
      return (
        <div className="ml-2">
          <h3 className="mb-1 font-semibold">{title}</h3>
          <p className="ml-[1px] text-left text-sm text-muted-foreground">
            Badge earned!
          </p>
        </div>
      );
  }
}
