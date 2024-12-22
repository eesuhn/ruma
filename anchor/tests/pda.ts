import { PublicKey } from '@solana/web3.js';
import {
  ATTENDEE_SEED,
  EVENT_DATA_SEED,
  EVENT_SEED,
  RUMA_PROGRAM_ID,
  USER_DATA_SEED,
  USER_SEED,
} from './constants';

export function getUserPdaAndBump(authority: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(USER_SEED), authority.toBuffer()],
    RUMA_PROGRAM_ID
  );
}

export function getUserDataPdaAndBump(userPda: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(USER_DATA_SEED), userPda.toBuffer()],
    RUMA_PROGRAM_ID
  );
}

export function getEventPdaAndBump(
  userPda: PublicKey,
  eventName: string
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(EVENT_SEED), userPda.toBuffer(), Buffer.from(eventName)],
    RUMA_PROGRAM_ID
  );
}

export function getEventDataPdaAndBump(
  eventPda: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(EVENT_DATA_SEED), eventPda.toBuffer()],
    RUMA_PROGRAM_ID
  );
}

export function getAttendeePdaAndBump(
  userPda: PublicKey,
  eventPda: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(ATTENDEE_SEED), userPda.toBuffer(), eventPda.toBuffer()],
    RUMA_PROGRAM_ID
  );
}