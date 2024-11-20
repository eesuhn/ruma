import { BN, Program, workspace } from "@coral-xyz/anchor";
import { shapes } from "@dicebear/collection";
import { createAvatar, Style } from "@dicebear/core";
import { fetchDigitalAsset, fetchMasterEdition, fetchMetadata, findEditionMarkerFromEditionNumberPda, findMasterEditionPda, findMetadataPda, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { createGenericFile } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mockStorage } from "@metaplex-foundation/umi-storage-mock";
import { ComputeBudgetProgram, Keypair, PublicKey } from "@solana/web3.js";
import { Ruma } from "../target/types/ruma";
import { getAccount, getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { fromWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters';

export const umi = createUmi("http://127.0.0.1:8899", "processed")
  .use(mockStorage())
  .use(mplTokenMetadata());

export const program = workspace.Ruma as Program<Ruma>;
export const connection = program.provider.connection;
export const masterWallet = Keypair.fromSecretKey(new Uint8Array(await Bun.file("ruma-wallet.json").json()));

export async function getFundedKeypair(): Promise<Keypair> {
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

  const keypair = Keypair.generate();

  await connection.confirmTransaction({
    blockhash,
    lastValidBlockHeight,
    signature: await connection.requestAirdrop(keypair.publicKey, 5_000_000_000)
  });

  return keypair;
}

export async function generateAvatarUri(style: Style<shapes.Options>, seed: string = ""): Promise<string> {
  const avatar = createAvatar(style, {
    seed,
    flip: Math.random() >= 0.5,
    rotate: Math.random() * 360,
  });

  const file = createGenericFile(
    avatar.toDataUri(),
    "image",
    {
      contentType: "image/svg+xml",
    }
  );

  const [uri] = await umi.uploader.upload([file]);

  return uri;
}

export function getUserPdaAndBump(address: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("user"), address.toBuffer()],
    program.programId
  );
}

export function getUserDataPdaAndBump(userPda: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("user_data"), userPda.toBuffer()],
    program.programId
  );
}

export function getEventPdaAndBump(userPda: PublicKey, eventName: string): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("event"), userPda.toBuffer(), Buffer.from(eventName)],
    program.programId
  );
}

export function getEventDataPdaAndBump(eventPda: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("event_data"), eventPda.toBuffer()],
    program.programId
  );
}

export function getAttendeePdaAndBump(userPda: PublicKey, eventPda: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("attendee"), userPda.toBuffer(), eventPda.toBuffer()],
    program.programId
  );
}

export async function createProfile(
  user: Keypair,
  userName: string,
  userImage: string,
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
    userAcc: await program.account.user.fetch(userPda),
    userDataAcc: await program.account.userData.fetch(userDataPda),
  }
}

export async function createEvent(
  organizer: Keypair,
  isPublic: boolean,
  needsApproval: boolean,
  eventName: string,
  eventImage: string,
  capacity: number | null,
  startTimeStamp: BN | null,
  endTimeStamp: BN | null,
  location: string | null,
  about: string | null,
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
      about,
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
    eventAcc: await program.account.event.fetch(eventPda),
    eventDataAcc: await program.account.eventData.fetch(eventDataPda),
  }
}

export async function createBadge(
  organizer: Keypair,
  masterMint: Keypair,
  eventPda: PublicKey,
  badgeName: string,
  badgeSymbol: string,
  badgeUri: string,
  maxSupply: BN | null,
) {
  await program.methods
    .createBadge(
      badgeName,
      badgeSymbol,
      badgeUri,
      maxSupply,
    )
    .accounts({
      payer: organizer.publicKey,
      event: eventPda,
      masterMint: masterMint.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .signers([organizer, masterMint])
    .preInstructions([
      ComputeBudgetProgram.setComputeUnitLimit({
        units: 400000,
      })
    ], true)
    .rpc();

  const [organizerUserPda] = getUserPdaAndBump(organizer.publicKey);
  const [masterMetadataPda] = findMetadataPda(umi, { mint: fromWeb3JsPublicKey(masterMint.publicKey) });
  const [masterEditionPda] = findMasterEditionPda(umi, { mint: fromWeb3JsPublicKey(masterMint.publicKey) });
  const masterAtaPda = getAssociatedTokenAddressSync(masterMint.publicKey, organizerUserPda, true);

  return {
    metadataAcc: await fetchMetadata(umi, masterMetadataPda),
    masterEditionAcc: await fetchMasterEdition(umi, masterEditionPda),
    eventAcc: await program.account.event.fetch(eventPda),
    masterTokenAcc: await getAccount(connection, masterAtaPda),
  }
}

export async function registerForEvent(
  organizerUserPda: PublicKey,
  registrantUserPda: PublicKey,
  eventName: string,
) {
  await program.methods
    .registerForEvent(eventName)
    .accounts({
      organizer: organizerUserPda,
      registrant: registrantUserPda,
    })
    .signers([masterWallet])
    .rpc();

  const [eventPda] = getEventPdaAndBump(organizerUserPda, eventName);
  const [attendeePda] = getAttendeePdaAndBump(registrantUserPda, eventPda);

  return {
    eventAcc: await program.account.event.fetch(eventPda),
    attendeeAcc: await program.account.attendee.fetch(attendeePda),
  }
}

export async function changeAttendeeStatus(
  registrantUserPda: PublicKey,
  eventPda: PublicKey,
  status: { approved: {} } | { rejected: {} },
) {
  await program.methods
    .changeAttendeeStatus(status)
    .accounts({
      user: registrantUserPda,
      event: eventPda,
    })
    .signers([masterWallet])
    .rpc();

  const [attendeePda] = getAttendeePdaAndBump(registrantUserPda, eventPda);

  return { attendeeAcc: await program.account.attendee.fetch(attendeePda) }
}

export async function checkIntoEvent(
  organizer: Keypair,
  editionMint: Keypair,
  registrantUserPda: PublicKey,
  attendeePda: PublicKey,
  masterMintPubkey: PublicKey,
  masterAtaPda: PublicKey,
  masterMetadataPda: PublicKey,
  masterEditionPda: PublicKey,
) {
  const masterEditionAcc = await fetchMasterEdition(umi, fromWeb3JsPublicKey(masterEditionPda))
  const editionNumber = Number(masterEditionAcc.supply) + 1;

  const [editionMarkerPda] = findEditionMarkerFromEditionNumberPda(umi, {
    mint: fromWeb3JsPublicKey(masterMintPubkey),
    editionNumber,
  })

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
    .preInstructions([
      ComputeBudgetProgram.setComputeUnitLimit({ units: 400000 }),
    ], true)
    .signers([masterWallet, organizer, editionMint])
    .rpc()

  return {
    editionAcc: await fetchDigitalAsset(umi, fromWeb3JsPublicKey(editionMint.publicKey)),
    registrantUserAcc: await program.account.user.fetch(registrantUserPda),
  }
}
