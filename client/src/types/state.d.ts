import { PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';

export interface Attendee {
  bump: number;
  status: { pending: {} } | { approved: {} } | { rejected: {} };
}

interface EventData {
  isPublic: boolean;
  needsApproval: boolean;
  name: string;
  image: string;
  capacity: number | null;
  startTimestamp: BN | null;
  endTimestamp: BN | null;
  location: string | null;
  about: string | null;
}

export interface Event {
  bump: number;
  organizer: PublicKey;
  data: EventData;
  badge: PublicKey | null;
  attendees: PublicKey[];
}

interface UserData {
  name: string;
  image: string;
}

export interface User {
  bump: number;
  data: UserData;
  badges: PublicKey[] | null;
}
