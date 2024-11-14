import { beforeAll, describe, expect, test } from "bun:test";
import { Ruma } from "../target/types/ruma";
import { AnchorProvider, BN, Program, web3, workspace } from "@coral-xyz/anchor";
import { createAvatar, Style } from "@dicebear/core";
import { icons, rings, shapes } from "@dicebear/collection";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mockStorage } from "@metaplex-foundation/umi-storage-mock";
import { createGenericFile, generateSigner, PublicKey } from "@metaplex-foundation/umi";
import { fetchMasterEdition, fetchMetadata, findMasterEditionPda, findMetadataPda, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

describe("ruma", () => {
  async function generateAvatarUri(style: Style<shapes.Options>, name: string, seed: string = ""): Promise<string> {
    const avatar = createAvatar(style, {
      seed,
      flip: Math.random() >= 0.5,
      rotate: Math.random() * 360,
    });

    const file = createGenericFile(
      avatar.toDataUri(),
      name,
      {
        contentType: "image/svg+xml",
      }
    );

    const [uri] = await umi.uploader.upload([file]);

    return uri;
  }

  const umi = createUmi("http://127.0.0.1:8899", "processed")
    .use(mockStorage())
    .use(mplTokenMetadata());

  const program = workspace.Ruma as Program<Ruma>;
  const programProvider = program.provider as AnchorProvider;
  const connection = programProvider.connection;

  let masterWalletKeypair: web3.Keypair;
  let organizerUserPDA: web3.PublicKey;
  let registrantUserPDA: web3.PublicKey;
  let eventPDA: web3.PublicKey;
  let optionalEventPDA: web3.PublicKey;
  let masterMintA: web3.Keypair;
  let masterMetadataA: PublicKey;
  let masterEditionA: PublicKey;
  let masterMintB: web3.Keypair;
  let masterMetadataB: PublicKey;
  let masterEditionB: PublicKey;
  let attendeePDA: web3.PublicKey;

  const organizer = web3.Keypair.generate();
  const registrant = web3.Keypair.generate();

  beforeAll(async () => {
    masterWalletKeypair = web3.Keypair.fromSecretKey(new Uint8Array(await Bun.file("ruma-wallet.json").json()));

    const sigA = await connection.requestAirdrop(organizer.publicKey, 5_000_000_000);
    const sigB = await connection.requestAirdrop(registrant.publicKey, 5_000_000_000);

    const { blockhash, lastValidBlockHeight } = await programProvider.connection.getLatestBlockhash();

    await connection.confirmTransaction({
      blockhash,
      lastValidBlockHeight,
      signature: sigA,
    });

    await connection.confirmTransaction({
      blockhash,
      lastValidBlockHeight,
      signature: sigB,
    });
  });

  test("create profiles", async () => {
    // default profile image
    const organizerName = "Jeff";
    const organizerImage = await generateAvatarUri(shapes, "organizerImage", organizer.publicKey.toBase58());

    await program.methods
      .createProfile(organizerName, organizerImage)
      .accounts({
        payer: organizer.publicKey,
      })
      .signers([organizer])
      .rpc();

    const [pda1, organizerUserBump] = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("user"),
        organizer.publicKey.toBuffer()
      ],
      program.programId
    );

    organizerUserPDA = pda1;

    const [organizerUserDataPDA, organizerUserDataBump] = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("user_data"),
        organizer.publicKey.toBuffer()
      ],
      program.programId
    );

    const organizerUserAcc = await program.account.user.fetch(organizerUserPDA);

    expect(organizerUserAcc.bump).toEqual(organizerUserBump);
    expect(organizerUserAcc.data).toEqual(organizerUserDataPDA);
    expect(organizerUserAcc.badges).toEqual([]);

    const organizerUserDataAcc = await program.account.userData.fetch(organizerUserDataPDA);

    expect(organizerUserDataAcc.bump).toEqual(organizerUserDataBump);
    expect(organizerUserDataAcc.name).toEqual(organizerName);
    expect(organizerUserDataAcc.image).toEqual(organizerImage);

    // default profile image
    const registrantName = "Bob";
    const registrantImage = await generateAvatarUri(shapes, "registrantImage", registrant.publicKey.toBase58());

    await program.methods
      .createProfile(registrantName, registrantImage)
      .accounts({
        payer: registrant.publicKey,
      })
      .signers([registrant])
      .rpc();

    const [pda2, registrantUserBump] = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("user"),
        registrant.publicKey.toBuffer()
      ],
      program.programId
    );

    registrantUserPDA = pda2;

    const [registrantUserDataPDA, registrantUserDataBump] = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("user_data"),
        registrant.publicKey.toBuffer()
      ],
      program.programId
    );

    const registrantUserAcc = await program.account.user.fetch(registrantUserPDA);

    expect(registrantUserAcc.bump).toEqual(registrantUserBump);
    expect(registrantUserAcc.data).toEqual(registrantUserDataPDA);
    expect(registrantUserAcc.badges).toEqual([]);

    const registrantUserDataAcc = await program.account.userData.fetch(registrantUserDataPDA);

    expect(registrantUserDataAcc.bump).toEqual(registrantUserDataBump);
    expect(registrantUserDataAcc.name).toEqual(registrantName);
    expect(registrantUserDataAcc.image).toEqual(registrantImage);
  })

  test("creates an event", async () => {
    // default event image
    const isPublic = true;
    const needsApproval = true;
    const capacity = 100;
    const startTimestamp = new BN(Date.now());
    // 24 hours after start
    const endTimestamp = new BN(Date.now() + 1000 * 60 * 60 * 24);
    const name = "EventA";
    const image = await generateAvatarUri(icons, "eventImage");
    const location = "Sunway University, Subang Jaya";
    const about = "This is a test event";

    await program.methods
      .createEvent(
        isPublic,
        needsApproval,
        name,
        image,
        capacity,
        startTimestamp,
        endTimestamp,
        location,
        about,
      )
      .accounts({
        payer: organizer.publicKey,
      })
      .signers([organizer])
      .rpc();

    const [pda, eventBump] = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("event"),
        organizerUserPDA.toBuffer(),
        Buffer.from(name)
      ],
      program.programId
    );

    eventPDA = pda;

    const [eventDataPDA, eventDataBump] = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("event_data"),
        organizerUserPDA.toBuffer(),
        Buffer.from(name)
      ],
      program.programId
    );

    const eventAcc = await program.account.event.fetch(eventPDA);

    expect(eventAcc.bump).toEqual(eventBump);
    expect(eventAcc.badge).toEqual(null);
    expect(eventAcc.organizer).toEqual(organizerUserPDA);
    expect(eventAcc.data).toEqual(eventDataPDA);
    expect(eventAcc.attendees).toEqual([]);

    const eventDataAcc = await program.account.eventData.fetch(eventDataPDA);

    expect(eventDataAcc.bump).toEqual(eventDataBump);
    expect(eventDataAcc.isPublic).toEqual(isPublic);
    expect(eventDataAcc.needsApproval).toEqual(needsApproval);
    expect(eventDataAcc.name).toEqual(name);
    expect(eventDataAcc.image).toEqual(image);
    expect(eventDataAcc.capacity).toEqual(capacity);
    expect(eventDataAcc.startTimestamp).toEqual(startTimestamp);
    expect(eventDataAcc.endTimestamp).toEqual(endTimestamp);
    expect(eventDataAcc.location).toEqual(location);
    expect(eventDataAcc.about).toEqual(about);
  });

  test("creates an event with optional values", async () => {
    // default event image
    const isPublic = true;
    const needsApproval = true;
    const name = "EventB";
    const image = await generateAvatarUri(icons, "eventImage");

    await program.methods
      .createEvent(
        isPublic,
        needsApproval,
        name,
        image,
        null,
        null,
        null,
        null,
        null
      )
      .accounts({
        payer: organizer.publicKey,
      })
      .signers([organizer])
      .rpc();

    const [pda, eventBump] = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("event"),
        organizerUserPDA.toBuffer(),
        Buffer.from(name)
      ],
      program.programId
    );

    optionalEventPDA = pda;

    const [optionalEventDataPDA, optionalEventDataBump] = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("event_data"),
        organizerUserPDA.toBuffer(),
        Buffer.from(name)
      ],
      program.programId
    );

    const eventAcc = await program.account.event.fetch(optionalEventPDA);

    expect(eventAcc.bump).toEqual(eventBump);
    expect(eventAcc.badge).toEqual(null);
    expect(eventAcc.organizer).toEqual(organizerUserPDA);
    expect(eventAcc.data).toEqual(optionalEventDataPDA);
    expect(eventAcc.attendees).toEqual([]);

    const eventDataAcc = await program.account.eventData.fetch(optionalEventDataPDA);

    expect(eventDataAcc.bump).toEqual(optionalEventDataBump);
    expect(eventDataAcc.isPublic).toEqual(isPublic);
    expect(eventDataAcc.needsApproval).toEqual(needsApproval);
    expect(eventDataAcc.name).toEqual(name);
    expect(eventDataAcc.image).toEqual(image);
    expect(eventDataAcc.capacity).toEqual(null);
    expect(eventDataAcc.startTimestamp).toEqual(null);
    expect(eventDataAcc.endTimestamp).toEqual(null);
    expect(eventDataAcc.location).toEqual(null);
    expect(eventDataAcc.about).toEqual(null);
  })

  test("creates a badge with max supply", async () => {
    const badgeName = "BadgeA";
    const badgeSymbol = "BDG";
    const badgeUri = await generateAvatarUri(rings, "badgeUri");
    // corresponds to capacity of event
    const maxSupply = 1;

    const umiMint = generateSigner(umi);
    masterMintA = web3.Keypair.fromSecretKey(umiMint.secretKey);

    await program.methods
      .createBadge(
        badgeName,
        badgeSymbol,
        badgeUri,
        new BN(maxSupply)
      )
      .accounts({
        payer: organizer.publicKey,
        event: eventPDA,
        masterMint: masterMintA.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([organizer, masterMintA])
      .preInstructions([
        web3.ComputeBudgetProgram.setComputeUnitLimit({ units: 400000 }),
      ], true)
      .rpc();

    [masterMetadataA] = findMetadataPda(umi, { mint: umiMint.publicKey });

    const metadataAcc = await fetchMetadata(umi, masterMetadataA);

    const organizerUserAcc = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("user"),
        organizer.publicKey.toBuffer()
      ],
      program.programId
    )[0];

    expect(metadataAcc.name).toEqual(badgeName);
    expect(metadataAcc.symbol).toEqual(badgeSymbol);
    expect(metadataAcc.uri).toEqual(badgeUri);
    // @ts-ignore
    expect(metadataAcc.creators.value[0].address).toEqual(organizerUserAcc.toBase58());

    [masterEditionA] = findMasterEditionPda(umi, { mint: umiMint.publicKey });

    const masterEditionAcc = await fetchMasterEdition(umi, masterEditionA);

    // @ts-ignore
    expect(Number(masterEditionAcc.maxSupply.value)).toEqual(maxSupply);
    expect(Number(masterEditionAcc.supply)).toEqual(0);

    const eventAcc = await program.account.event.fetch(eventPDA);

    expect(eventAcc.badge.toBase58()).toEqual(masterEditionA);

    const masterTokenAccountPda = getAssociatedTokenAddressSync(masterMintA.publicKey, organizerUserPDA, true);
    const masterTokenAccount = await getAccount(connection, masterTokenAccountPda);

    expect(Number(masterTokenAccount.amount)).toEqual(1);
  })

  test("creates a badge without max supply", async () => {
    const badgeName = "BadgeB";
    const badgeSymbol = "BDG";
    const badgeUri = await generateAvatarUri(rings, "badgeUri");

    const umiMint = generateSigner(umi);
    masterMintB = web3.Keypair.fromSecretKey(umiMint.secretKey);

    await program.methods
      .createBadge(
        badgeName,
        badgeSymbol,
        badgeUri,
        null
      )
      .accounts({
        payer: organizer.publicKey,
        event: optionalEventPDA,
        masterMint: masterMintB.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([organizer, masterMintB])
      .preInstructions([
        web3.ComputeBudgetProgram.setComputeUnitLimit({ units: 400000 }),
      ], true)
      .rpc();

    [masterMetadataB] = findMetadataPda(umi, { mint: umiMint.publicKey });

    const metadataAcc = await fetchMetadata(umi, masterMetadataB);

    const organizerUserAcc = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("user"),
        organizer.publicKey.toBuffer()
      ],
      program.programId
    )[0];

    expect(metadataAcc.name).toEqual(badgeName);
    expect(metadataAcc.symbol).toEqual(badgeSymbol);
    expect(metadataAcc.uri).toEqual(badgeUri);
    // @ts-ignore
    expect(metadataAcc.creators.value[0].address).toEqual(organizerUserAcc.toBase58());

    [masterEditionB] = findMasterEditionPda(umi, { mint: umiMint.publicKey });

    const masterEditionAcc = await fetchMasterEdition(umi, masterEditionB);

    // @ts-ignore
    expect(masterEditionAcc.maxSupply.value).toEqual(undefined);
    expect(Number(masterEditionAcc.supply)).toEqual(0);

    const eventAcc = await program.account.event.fetch(optionalEventPDA);

    expect(eventAcc.badge.toBase58()).toEqual(masterEditionB);

    const masterTokenAccountPda = getAssociatedTokenAddressSync(masterMintB.publicKey, organizerUserPDA, true);
    const masterTokenAccount = await getAccount(connection, masterTokenAccountPda);

    expect(Number(masterTokenAccount.amount)).toEqual(1);
  })

  test("registers for an event", async () => {
    const name = "EventA";

    await program.methods
      .registerForEvent(name)
      .accounts({
        organizer: organizerUserPDA,
        registrant: registrantUserPDA,
      })
      .signers([masterWalletKeypair])
      .rpc();

    const [pda, attendeeBump] = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("attendee"),
        registrantUserPDA.toBuffer(),
        eventPDA.toBuffer(),
      ],
      program.programId
    )

    attendeePDA = pda;

    const attendeeAcc = await program.account.attendee.fetch(attendeePDA);

    expect(attendeeAcc.bump).toEqual(attendeeBump);
    expect(attendeeAcc.status).toEqual({ pending: {} });

    const eventAcc = await program.account.event.fetch(eventPDA);

    expect(eventAcc.attendees[0]).toEqual(attendeePDA);
  })

  test("changing attendee status", async () => {
    const newStatus = { approved: {} };

    await program.methods
      .changeAttendeeStatus(newStatus)
      .accounts({
        user: registrantUserPDA,
        event: eventPDA,
      })
      .signers([masterWalletKeypair])
      .rpc();

    const attendeeAcc = await program.account.attendee.fetch(attendeePDA);

    expect(attendeeAcc.status).toEqual(newStatus);
  })
})
