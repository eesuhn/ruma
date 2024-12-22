import { Program } from '@coral-xyz/anchor';
import { Ruma } from '../target/types/ruma';
import { PublicKey } from '@solana/web3.js';

export async function getUserAcc(program: Program<Ruma>, userPda: PublicKey) {
  return await program.account.user.fetchNullable(userPda);
}

export async function getUserDataAcc(
  program: Program<Ruma>,
  userDataPda: PublicKey
) {
  return await program.account.userData.fetchNullable(userDataPda);
}

export async function getEventAcc(program: Program<Ruma>, eventPda: PublicKey) {
  return await program.account.event.fetchNullable(eventPda);
}

export async function getEventDataAcc(
  program: Program<Ruma>,
  eventDataPda: PublicKey
) {
  return await program.account.eventData.fetchNullable(eventDataPda);
}

export async function getAttendeeAcc(
  program: Program<Ruma>,
  attendeePda: PublicKey
) {
  return await program.account.attendee.fetchNullable(attendeePda);
}
