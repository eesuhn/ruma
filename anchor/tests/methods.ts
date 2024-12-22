import { ComputeBudgetProgram, Keypair, PublicKey } from '@solana/web3.js';
import { Ruma } from '../target/types/ruma';
import { BN, Program } from '@coral-xyz/anchor';
import {
  getAttendeePdaAndBump,
  getEventDataPdaAndBump,
  getEventPdaAndBump,
  getUserDataPdaAndBump,
  getUserPdaAndBump,
} from './pda';
import {
  getAccount,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import {
  fetchDigitalAsset,
  fetchMasterEdition,
  fetchMetadata,
  findEditionMarkerFromEditionNumberPda,
  findMasterEditionPda,
  findMetadataPda,
} from '@metaplex-foundation/mpl-token-metadata';
import { Umi } from '@metaplex-foundation/umi';
import { fromWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters';
import {
  getAttendeeAcc,
  getEventAcc,
  getEventDataAcc,
  getUserAcc,
  getUserDataAcc,
} from './accounts';
import { RUMA_MASTER_WALLET } from './constants';

export async function createProfile(
  program: Program<Ruma>,
  userName: string,
  userImage: string,
  user: Keypair
) {
  await program.methods
    .createProfile(userName, userImage)
    .accounts({
      payer: user.publicKey,
    })
    .signers([user])
    .rpc();

  const [userPda] = getUserPdaAndBump(user.publicKey);
  const [userDataPda] = getUserDataPdaAndBump(userPda);

  return {
    userAcc: await getUserAcc(program, userPda),
    userDataAcc: await getUserDataAcc(program, userDataPda),
  };
}

export async function createEvent(
  program: Program<Ruma>,
  isPublic: boolean,
  needsApproval: boolean,
  eventName: string,
  eventImage: string,
  capacity: number | null,
  startTimeStamp: BN | null,
  endTimeStamp: BN | null,
  location: string | null,
  about: string | null,
  organizer: Keypair
) {
  await program.methods
    .createEvent(
      isPublic,
      needsApproval,
      eventName,
      eventImage,
      capacity,
      startTimeStamp,
      endTimeStamp,
      location,
      about
    )
    .accounts({
      payer: organizer.publicKey,
    })
    .signers([organizer])
    .rpc();

  const [organizerUserPda] = getUserPdaAndBump(organizer.publicKey);
  const [eventPda] = getEventPdaAndBump(organizerUserPda, eventName);
  const [eventDataPda] = getEventDataPdaAndBump(eventPda);

  return {
    eventAcc: await getEventAcc(program, eventPda),
    eventDataAcc: await getEventDataAcc(program, eventDataPda),
  };
}

export async function createBadge(
  program: Program<Ruma>,
  umi: Umi,
  badgeName: string,
  badgeSymbol: string,
  badgeUri: string,
  maxSupply: BN | null,
  organizer: Keypair,
  eventPda: PublicKey,
  masterMint: Keypair
) {
  await program.methods
    .createBadge(badgeName, badgeSymbol, badgeUri, maxSupply)
    .accounts({
      payer: organizer.publicKey,
      event: eventPda,
      masterMint: masterMint.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .signers([organizer, masterMint])
    .preInstructions(
      [
        ComputeBudgetProgram.setComputeUnitLimit({
          units: 400000,
        }),
      ],
      true
    )
    .rpc();

  const [organizerUserPda] = getUserPdaAndBump(organizer.publicKey);
  const [masterMetadataPda] = findMetadataPda(umi, {
    mint: fromWeb3JsPublicKey(masterMint.publicKey),
  });
  const [masterEditionPda] = findMasterEditionPda(umi, {
    mint: fromWeb3JsPublicKey(masterMint.publicKey),
  });
  const masterAtaPda = getAssociatedTokenAddressSync(
    masterMint.publicKey,
    organizerUserPda,
    true
  );

  return {
    metadataAcc: await fetchMetadata(umi, masterMetadataPda),
    masterEditionAcc: await fetchMasterEdition(umi, masterEditionPda),
    eventAcc: await getEventAcc(program, eventPda),
    masterTokenAcc: await getAccount(program.provider.connection, masterAtaPda),
  };
}

export async function registerForEvent(
  program: Program<Ruma>,
  eventName: string,
  organizerUserPda: PublicKey,
  registrantUserPda: PublicKey
) {
  await program.methods
    .registerForEvent(eventName)
    .accounts({
      organizer: organizerUserPda,
      registrant: registrantUserPda,
    })
    .signers([RUMA_MASTER_WALLET])
    .rpc();

  const [eventPda] = getEventPdaAndBump(organizerUserPda, eventName);
  const [attendeePda] = getAttendeePdaAndBump(registrantUserPda, eventPda);

  return {
    eventAcc: await getEventAcc(program, eventPda),
    attendeeAcc: await getAttendeeAcc(program, attendeePda),
  };
}

export async function changeAttendeeStatus(
  program: Program<Ruma>,
  status: { approved: {} } | { rejected: {} },
  registrantUserPda: PublicKey,
  eventPda: PublicKey
) {
  await program.methods
    .changeAttendeeStatus(status)
    .accounts({
      user: registrantUserPda,
      event: eventPda,
    })
    .signers([RUMA_MASTER_WALLET])
    .rpc();

  const [attendeePda] = getAttendeePdaAndBump(registrantUserPda, eventPda);

  return { attendeeAcc: await getAttendeeAcc(program, attendeePda) };
}

export async function checkIntoEvent(
  program: Program<Ruma>,
  umi: Umi,
  organizer: Keypair,
  editionMint: Keypair,
  registrantUserPda: PublicKey,
  attendeePda: PublicKey,
  masterMintPubkey: PublicKey,
  masterAtaPda: PublicKey,
  masterMetadataPda: PublicKey,
  masterEditionPda: PublicKey
) {
  const masterEditionAcc = await fetchMasterEdition(
    umi,
    fromWeb3JsPublicKey(masterEditionPda)
  );
  const editionNumber = Number(masterEditionAcc.supply) + 1;

  const [editionMarkerPda] = findEditionMarkerFromEditionNumberPda(umi, {
    mint: fromWeb3JsPublicKey(masterMintPubkey),
    editionNumber,
  });

  await program.methods
    .checkIntoEvent(new BN(editionNumber))
    .accountsPartial({
      host: organizer.publicKey,
      registrant: registrantUserPda,
      attendee: attendeePda,
      editionMint: editionMint.publicKey,
      editionMarkerPda,
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
    .signers([RUMA_MASTER_WALLET, organizer, editionMint])
    .rpc();

  return {
    editionAcc: await fetchDigitalAsset(
      umi,
      fromWeb3JsPublicKey(editionMint.publicKey)
    ),
    registrantUserAcc: await getUserAcc(program, registrantUserPda),
  };
}
