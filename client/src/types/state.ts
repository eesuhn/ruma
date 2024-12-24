import { PublicKey } from '@solana/web3.js';

export interface Attendee {
  bump: number;
  status: { pending: {} } | { approved: {} } | { rejected: {} };
}

export interface EventData {
  bump: number;
  isPublic: boolean;
  needsApproval: boolean;
  name: string;
  image: string;
  capacity: number | null | undefined;
  startTimestamp: number | null | undefined;
  endTimestamp: number | null | undefined;
  location: string | null | undefined;
  about: string | null | undefined;
}

export interface Event {
  bump: number;
  organizer: PublicKey;
  data: PublicKey;
  badge: PublicKey | null | undefined;
  attendees: PublicKey[];
}

export interface UserData {
  bump: number;
  name: string;
  image: string;
}

export interface User {
  bump: number;
  data: PublicKey;
  badges: PublicKey[] | null | undefined;
}
