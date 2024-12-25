import { Ruma } from '@/types/ruma';
import { AnchorProvider, BN, Program } from '@coral-xyz/anchor';
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';
import { useCallback, useMemo, useState } from 'react';
import idl from '@/idl/ruma.json';
import {
  ComputeBudgetProgram,
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
  TransactionSignature,
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { getEventPda, getUserPda } from '@/lib/pda';
import { RUMA_WALLET } from '@/lib/constants';

export function useAnchorProgram() {
  const [program, setProgram] = useState<Program<Ruma> | null>(null);
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const wallet = useAnchorWallet();

  useMemo(() => {
    if (wallet) {
      const provider = new AnchorProvider(connection, wallet, { commitment: 'confirmed' });
      setProgram(new Program(idl as Ruma, provider));
    }
  }, [connection, wallet]);

  async function getCreateProfileTx(
    userName: string,
    userImage: string
  ): Promise<Transaction> {
    return await program!.methods
      .createProfile(userName, userImage)
      .accounts({
        payer: publicKey!,
      })
      .transaction();
  }

  async function getCreateEventIx(
    isPublic: boolean,
    needsApproval: boolean,
    eventName: string,
    eventImage: string,
    capacity: number | null,
    startTimeStamp: number | null,
    endTimeStamp: number | null,
    location: string | null,
    about: string | null
  ): Promise<TransactionInstruction> {
    return await program!.methods
      .createEvent(
        isPublic,
        needsApproval,
        eventName,
        eventImage,
        capacity,
        startTimeStamp ? new BN(startTimeStamp) : null,
        endTimeStamp ? new BN(endTimeStamp) : null,
        location,
        about
      )
      .accounts({
        payer: publicKey!,
      })
      .instruction();
  }

  async function getCreateBadgeIx(
    eventName: string,
    badgeName: string,
    badgeSymbol: string,
    badgeUri: string,
    maxSupply: number | null
  ): Promise<TransactionInstruction> {
    return await program!.methods
      .createBadge(
        badgeName,
        badgeSymbol,
        badgeUri,
        maxSupply ? new BN(maxSupply) : null
      )
      .accounts({
        payer: publicKey!,
        event: getEventPda(publicKey!, eventName),
        masterMint: Keypair.generate().publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .preInstructions(
        [
          ComputeBudgetProgram.setComputeUnitLimit({
            units: 400000,
          }),
        ],
        true
      )
      .instruction();
  }

  async function registerForEvent(
    eventName: string,
    organizerPda: PublicKey
  ): Promise<TransactionSignature> {
    return await program!.methods
      .registerForEvent(eventName)
      .accounts({
        organizer: organizerPda,
        registrant: getUserPda(publicKey!),
      })
      .signers([RUMA_WALLET])
      .rpc();
  }

  async function changeAttendeeStatus(
    status: { approved: {} } | { rejected: {} },
    eventPda: PublicKey
  ): Promise<TransactionSignature> {
    return await program!.methods
      .changeAttendeeStatus(status)
      .accounts({
        user: getUserPda(publicKey!),
        event: eventPda,
      })
      .signers([RUMA_WALLET])
      .rpc();
  }

  async function getCheckIntoEventTx(
    editionNumber: number,
    registrantUserPda: PublicKey,
    attendeePda: PublicKey,
    editionMint: Keypair,
    masterMintPubkey: PublicKey,
    masterAtaPda: PublicKey,
    masterMetadataPda: PublicKey,
    masterEditionPda: PublicKey
  ): Promise<Transaction> {
    return await program!.methods
      .checkIntoEvent(new BN(editionNumber))
      .accounts({
        host: publicKey!,
        registrant: registrantUserPda,
        attendee: attendeePda,
        editionMint: editionMint.publicKey,
        masterMint: masterMintPubkey,
        masterTokenAccount: masterAtaPda,
        masterMetadata: masterMetadataPda,
        masterEdition: masterEditionPda,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .preInstructions(
        [ComputeBudgetProgram.setComputeUnitLimit({ units: 400000 })],
        true
      )
      .signers([RUMA_WALLET, editionMint])
      .transaction();
  }

  const getUserAcc = useCallback(async (userPda: PublicKey) => {
    if (program) {
      return await program.account.user.fetchNullable(userPda);
    }
  }, [program]);

  const getUserDataAcc = useCallback(async (userDataPda: PublicKey) => {
    if (program) {
      return await program.account.userData.fetchNullable(userDataPda);
    }
  }, [program]);

  const getEventAcc = useCallback(async (eventPda: PublicKey) => {
    if (program) {
      return await program.account.event.fetchNullable(eventPda);
    }
  }, [program]);

  const getEventDataAcc = useCallback(async (eventDataPda: PublicKey) => {
    if (program) {
      return await program.account.eventData.fetchNullable(eventDataPda);
    }
  }, [program]);

  const getAttendeeAcc = useCallback(async (attendeePda: PublicKey) => {
    if (program) {
      return await program.account.attendee.fetchNullable(attendeePda);
    }
  }, [program]);

  return {
    getUserAcc,
    getUserDataAcc,
    getEventAcc,
    getEventDataAcc,
    getAttendeeAcc,
    getCreateProfileTx,
    getCreateEventIx,
    getCreateBadgeIx,
    registerForEvent,
    changeAttendeeStatus,
    getCheckIntoEventTx,
  };
}
