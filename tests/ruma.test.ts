import { beforeAll, describe, expect, test } from "bun:test";
import { Ruma } from "../target/types/ruma";
import { AnchorError, AnchorProvider, BN, Program, web3, workspace } from "@coral-xyz/anchor";
import { createAvatar, Style } from "@dicebear/core";
import { icons, rings, shapes } from "@dicebear/collection";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mockStorage } from "@metaplex-foundation/umi-storage-mock";
import { createGenericFile, generateSigner, publicKey, PublicKey } from "@metaplex-foundation/umi";
import { fetchDigitalAsset, fetchMasterEdition, fetchMetadata, findEditionMarkerFromEditionNumberPda, findMasterEditionPda, findMetadataPda, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { getAccount, getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID } from "@solana/spl-token";

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
  let organizerUserPda: web3.PublicKey;
  let organizerUserBump: number;
  let registrantAUserPda: web3.PublicKey;
  let registrantAUserBump: number;
  let registrantBUserPda: web3.PublicKey;
  let registrantBUserBump: number;
  let eventPda: web3.PublicKey;
  let eventBump: number;
  let optionalEventPda: web3.PublicKey;
  let optionalEventBump: number;
  let masterMintA: web3.Keypair;
  let masterMetadataA: PublicKey;
  let masterEditionA: PublicKey;
  let masterMintB: web3.Keypair;
  let masterMetadataB: PublicKey;
  let masterEditionB: PublicKey;
  let attendeePda: web3.PublicKey;
  let attendeeBump: number;

  const organizer = web3.Keypair.generate();
  const registrantA = web3.Keypair.generate();
  const registrantB = web3.Keypair.generate();

  beforeAll(async () => {
    masterWalletKeypair = web3.Keypair.fromSecretKey(new Uint8Array(await Bun.file("ruma-wallet.json").json()));

    [organizerUserPda, organizerUserBump] = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("user"),
        organizer.publicKey.toBuffer()
      ],
      program.programId
    );

    [registrantAUserPda, registrantAUserBump] = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("user"),
        registrantA.publicKey.toBuffer()
      ],
      program.programId
    );

    [registrantBUserPda, registrantBUserBump] = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("user"),
        registrantB.publicKey.toBuffer()
      ],
      program.programId
    );

    [eventPda, eventBump] = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("event"),
        organizerUserPda.toBuffer(),
        Buffer.from("EventA")
      ],
      program.programId
    );

    [optionalEventPda, optionalEventBump] = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("event"),
        organizerUserPda.toBuffer(),
        Buffer.from("EventB")
      ],
      program.programId
    );

    [attendeePda, attendeeBump] = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("attendee"),
        registrantAUserPda.toBuffer(),
        eventPda.toBuffer()
      ],
      program.programId
    );

    const sigA = await connection.requestAirdrop(organizer.publicKey, 5_000_000_000);
    const sigB = await connection.requestAirdrop(registrantA.publicKey, 5_000_000_000);
    const sigC = await connection.requestAirdrop(registrantB.publicKey, 5_000_000_000);

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

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

    await connection.confirmTransaction({
      blockhash,
      lastValidBlockHeight,
      signature: sigC,
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

    const [organizerUserDataPDA, organizerUserDataBump] = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("user_data"),
        organizer.publicKey.toBuffer()
      ],
      program.programId
    );

    const organizerUserAcc = await program.account.user.fetch(organizerUserPda);

    expect(organizerUserAcc.bump).toEqual(organizerUserBump);
    expect(organizerUserAcc.data).toEqual(organizerUserDataPDA);
    expect(organizerUserAcc.badges).toEqual([]);

    const organizerUserDataAcc = await program.account.userData.fetch(organizerUserDataPDA);

    expect(organizerUserDataAcc.bump).toEqual(organizerUserDataBump);
    expect(organizerUserDataAcc.name).toEqual(organizerName);
    expect(organizerUserDataAcc.image).toEqual(organizerImage);

    // default profile image
    const registrantName = "Bob";
    const registrantImage = await generateAvatarUri(shapes, "registrantAImage", registrantA.publicKey.toBase58());

    await program.methods
      .createProfile(registrantName, registrantImage)
      .accounts({
        payer: registrantA.publicKey,
      })
      .signers([registrantA])
      .rpc();

    const [registrantUserDataPDA, registrantUserDataBump] = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("user_data"),
        registrantA.publicKey.toBuffer()
      ],
      program.programId
    );

    const registrantUserAcc = await program.account.user.fetch(registrantAUserPda);

    expect(registrantUserAcc.bump).toEqual(registrantAUserBump);
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
    const capacity = 1;
    const startTimestamp = new BN(Date.now());
    // 24 hours after start
    const endTimestamp = new BN(Date.now() + 1000 * 60 * 60 * 24);
    const name = "EventA";
    const image = await generateAvatarUri(icons, "eventAImage");
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

    const [eventDataPDA, eventDataBump] = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("event_data"),
        organizerUserPda.toBuffer(),
        Buffer.from(name)
      ],
      program.programId
    );

    const eventAcc = await program.account.event.fetch(eventPda);

    expect(eventAcc.bump).toEqual(eventBump);
    expect(eventAcc.badge).toEqual(null);
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
    const image = await generateAvatarUri(icons, "eventBImage");

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

    const [optionalEventDataPDA, optionalEventDataBump] = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("event_data"),
        organizerUserPda.toBuffer(),
        Buffer.from(name)
      ],
      program.programId
    );

    const eventAcc = await program.account.event.fetch(optionalEventPda);

    expect(eventAcc.bump).toEqual(optionalEventBump);
    expect(eventAcc.badge).toEqual(null);
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
        event: eventPda,
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

    expect(metadataAcc.name).toEqual(badgeName);
    expect(metadataAcc.symbol).toEqual(badgeSymbol);
    expect(metadataAcc.uri).toEqual(badgeUri);
    // @ts-ignore
    expect(metadataAcc.creators.value[0].address).toEqual(organizerUserPda.toBase58());

    [masterEditionA] = findMasterEditionPda(umi, { mint: umiMint.publicKey });

    const masterEditionAcc = await fetchMasterEdition(umi, masterEditionA);

    // @ts-ignore
    expect(Number(masterEditionAcc.maxSupply.value)).toEqual(maxSupply);
    expect(Number(masterEditionAcc.supply)).toEqual(0);

    const eventAcc = await program.account.event.fetch(eventPda);

    expect(eventAcc.badge).toEqual(masterMintA.publicKey);

    const masterTokenAccountPda = getAssociatedTokenAddressSync(masterMintA.publicKey, organizerUserPda, true);
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
        event: optionalEventPda,
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

    expect(metadataAcc.name).toEqual(badgeName);
    expect(metadataAcc.symbol).toEqual(badgeSymbol);
    expect(metadataAcc.uri).toEqual(badgeUri);
    // @ts-ignore
    expect(metadataAcc.creators.value[0].address).toEqual(organizerUserPda.toBase58());

    [masterEditionB] = findMasterEditionPda(umi, { mint: umiMint.publicKey });

    const masterEditionAcc = await fetchMasterEdition(umi, masterEditionB);

    // @ts-ignore
    expect(masterEditionAcc.maxSupply.value).toEqual(undefined);
    expect(Number(masterEditionAcc.supply)).toEqual(0);

    const eventAcc = await program.account.event.fetch(optionalEventPda);

    expect(eventAcc.badge).toEqual(masterMintB.publicKey);

    const masterTokenAccountPda = getAssociatedTokenAddressSync(masterMintB.publicKey, organizerUserPda, true);
    const masterTokenAccount = await getAccount(connection, masterTokenAccountPda);

    expect(Number(masterTokenAccount.amount)).toEqual(1);
  })

  test("registers for an event", async () => {
    const name = "EventA";

    await program.methods
      .registerForEvent(name)
      .accounts({
        organizer: organizerUserPda,
        registrant: registrantAUserPda,
      })
      .signers([masterWalletKeypair])
      .rpc();

    const attendeeAcc = await program.account.attendee.fetch(attendeePda);

    expect(attendeeAcc.bump).toEqual(attendeeBump);
    expect(attendeeAcc.status).toEqual({ pending: {} });

    const eventAcc = await program.account.event.fetch(eventPda);

    expect(eventAcc.attendees[0]).toEqual(attendeePda);
  })

  test("changing attendee status", async () => {
    const newStatus = { approved: {} };

    await program.methods
      .changeAttendeeStatus(newStatus)
      .accounts({
        user: registrantAUserPda,
        event: eventPda,
      })
      .signers([masterWalletKeypair])
      .rpc();

    const attendeeAcc = await program.account.attendee.fetch(attendeePda);

    expect(attendeeAcc.status).toEqual(newStatus);
  })

  test("checking into an event", async () => {
    const masterEditionAcc = await fetchMasterEdition(umi, masterEditionA);
    const editionNumber = Number(masterEditionAcc.supply) + 1;

    const umiMint = generateSigner(umi);
    const editionMint = web3.Keypair.fromSecretKey(umiMint.secretKey);

    const [editionMarkerPda] = findEditionMarkerFromEditionNumberPda(umi, {
      mint: publicKey(masterMintA.publicKey),
      editionNumber
    });

    const masterTokenAccount = getAssociatedTokenAddressSync(masterMintA.publicKey, organizerUserPda, true);

    await program.methods
      .checkIntoEvent(new BN(editionNumber))
      .accountsPartial({
        host: organizer.publicKey,
        registrant: registrantAUserPda,
        editionMint: editionMint.publicKey,
        editionMarkerPda,
        masterMint: masterMintA.publicKey,
        masterTokenAccount,
        masterMetadata: masterMetadataA,
        masterEdition: masterEditionA,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .preInstructions([
        web3.ComputeBudgetProgram.setComputeUnitLimit({ units: 400000 }),
      ], true)
      .signers([masterWalletKeypair, editionMint, organizer])
      .rpc()

    // findMasterEditionPda is also used to derive pda of printed editions
    const [edition] = findMasterEditionPda(umi, { mint: umiMint.publicKey });
    const editionAcc = await fetchDigitalAsset(umi, umiMint.publicKey)

    expect(editionAcc.edition.isOriginal).toEqual(false);
    expect(editionAcc.edition.publicKey).toEqual(edition);
    // @ts-ignore
    expect(Number(editionAcc.edition.edition)).toEqual(editionNumber);

    const registrantUserAcc = await program.account.user.fetch(registrantAUserPda);

    expect(registrantUserAcc.badges[0]).toEqual(editionMint.publicKey);
  });

  test("throws when registering for the same event again", async () => {
    try {
      await program.methods
        .registerForEvent("EventA")
        .accounts({
          organizer: organizerUserPda,
          registrant: registrantAUserPda,
        })
        .signers([masterWalletKeypair])
        .rpc();
    } catch (err) {
      expect(err).toBeInstanceOf(web3.SendTransactionError);
      expect(err.logs).toEqual(
        expect.arrayContaining([
          expect.stringMatching(/Allocate: account Address \{[^}]+\} already in use/)
        ])
      );
    }
  });

  test("throws when registering for a full event", async () => {
    const eventName = "EventA";

    await program.methods
      .createProfile(
        "Dylan",
        await generateAvatarUri(shapes, "registrantBImage", organizer.publicKey.toBase58())
      )
      .accounts({
        payer: registrantB.publicKey,
      })
      .signers([registrantB])
      .rpc()

    try {
      await program.methods
        .registerForEvent(eventName)
        .accounts({
          organizer: organizerUserPda,
          registrant: registrantBUserPda,
        })
        .signers([masterWalletKeypair])
        .rpc();
    } catch (err) {
      expect(err).toBeInstanceOf(AnchorError);
      expect(err.error.errorCode.code).toEqual("EventCapacityMaxReached");
      expect(err.error.errorCode.number).toEqual(6009);
    }
  });

  test("throws when changing status of user that has not registered", async () => {
    try {
      await program.methods
        .changeAttendeeStatus({ approved: {} })
        .accounts({
          user: registrantAUserPda,
          event: optionalEventPda,
        })
        .signers([masterWalletKeypair])
        .rpc();
    } catch (err) {
      expect(err).toBeInstanceOf(AnchorError);
      expect(err.error.errorCode.code).toEqual("AccountNotInitialized");
      expect(err.error.errorCode.number).toEqual(3012);
      expect(err.error.origin).toEqual("attendee");
    }
  });
})
