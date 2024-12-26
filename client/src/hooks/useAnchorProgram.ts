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
  Keypair,
  PublicKey,
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
      const provider = new AnchorProvider(connection, wallet, {
        commitment: 'confirmed',
      });
      setProgram(new Program(idl as Ruma, provider));
    }
  }, [connection, wallet]);

  async function getCreateProfileIx(
    userName: string,
    userImage: string
  ): Promise<TransactionInstruction> {
    return await program!.methods
      .createProfile(userName, userImage)
      .accounts({
        authority: publicKey!,
      })
      .instruction();
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
        authority: publicKey!,
      })
      .instruction();
  }

  async function getCreateBadgeIx(
    eventName: string,
    badgeName: string,
    badgeSymbol: string,
    badgeUri: string,
    maxSupply: number | null,
    masterMint: Keypair
  ): Promise<TransactionInstruction> {
    const userPda = getUserPda(publicKey!);

    return await program!.methods
      .createBadge(
        badgeName,
        badgeSymbol,
        badgeUri,
        maxSupply ? new BN(maxSupply) : null
      )
      .accounts({
        authority: publicKey!,
        event: getEventPda(userPda, eventName),
        masterMint: masterMint.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .instruction();
  }

  async function registerForEvent(
    eventPda: PublicKey
  ): Promise<TransactionSignature> {
    return await program!.methods
      .registerForEvent()
      .accounts({
        registrant: getUserPda(publicKey!),
        event: eventPda,
      })
      .signers([RUMA_WALLET])
      .rpc();
  }

  async function changeAttendeeStatus(
    status: { approved: {} } | { rejected: {} },
    registrantPda: PublicKey,
    eventPda: PublicKey
  ): Promise<TransactionSignature> {
    return await program!.methods
      .changeAttendeeStatus(status)
      .accounts({
        registrant: registrantPda,
        event: eventPda,
      })
      .signers([RUMA_WALLET])
      .rpc();
  }

  async function getCheckIntoEventIx(
    editionNumber: number,
    registrantUserPda: PublicKey,
    attendeePda: PublicKey,
    editionMint: Keypair,
    masterMintPubkey: PublicKey,
    masterAtaPda: PublicKey,
    masterMetadataPda: PublicKey,
    masterEditionPda: PublicKey
  ): Promise<TransactionInstruction> {
    return await program!.methods
      .checkIntoEvent(new BN(editionNumber))
      .accounts({
        authority: publicKey!,
        registrant: registrantUserPda,
        attendee: attendeePda,
        editionMint: editionMint.publicKey,
        masterMint: masterMintPubkey,
        masterTokenAccount: masterAtaPda,
        masterMetadata: masterMetadataPda,
        masterEdition: masterEditionPda,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([RUMA_WALLET, editionMint])
      .instruction();
  }

  const getUserAcc = useCallback(
    async (userPda: PublicKey) => {
      if (program) {
        return await program.account.user.fetchNullable(userPda);
      }
    },
    [program]
  );

  const getEventAcc = useCallback(
    async (eventPda: PublicKey) => {
      if (program) {
        return await program.account.event.fetchNullable(eventPda);
      }
    },
    [program]
  );

  const getAttendeeAcc = useCallback(
    async (attendeePda: PublicKey) => {
      if (program) {
        return await program.account.attendee.fetchNullable(attendeePda);
      }
    },
    [program]
  );

  return {
    getUserAcc,
    getEventAcc,
    getAttendeeAcc,
    getCreateProfileIx,
    getCreateEventIx,
    getCreateBadgeIx,
    registerForEvent,
    changeAttendeeStatus,
    getCheckIntoEventIx,
  };
}
