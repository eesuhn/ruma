import { ProgramAccount } from '@coral-xyz/anchor';
import { Event } from './idlAccounts';

export type RegistrationStatus =
  | 'pending'
  | 'going'
  | 'checked-in'
  | 'rejected';

export type DisplayedEvent = {
  event: ProgramAccount<Event>;
  isOrganizer: boolean;
};

export type EventStatus =
  | 'organizer'
  | 'not-registered'
  | 'pending'
  | 'event-not-started'
  | 'not-checked-in'
  | 'checked-in'
  | 'rejected';
