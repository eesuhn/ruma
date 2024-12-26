'use server';

import { CONNECTION, RUMA_WALLET } from '@/lib/constants';
import { Ruma } from '@/types/ruma';
import {
  AnchorProvider,
  Program,
  setProvider,
  Wallet,
  workspace,
} from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';

const program = workspace.Ruma as Program<Ruma>;
setProvider(
  new AnchorProvider(CONNECTION, new Wallet(RUMA_WALLET), {
    commitment: 'confirmed',
  })
);

export async function getAllUserAcc() {
  return await program.account.user.all();
}

export async function getUserAcc(userPda: PublicKey) {
  return await program.account.user.fetchNullable(userPda);
}

export async function getAllEventAcc() {
  return await program.account.event.all();
}

export async function getEventAcc(eventPda: PublicKey) {
  return await program.account.event.fetchNullable(eventPda);
}

export async function getAllAttendeeAcc() {
  return await program.account.attendee.all();
}

export async function getAttendeeAcc(attendeePda: PublicKey) {
  return await program.account.attendee.fetchNullable(attendeePda);
}
