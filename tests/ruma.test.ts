import { beforeAll, describe, expect, test } from "bun:test";
import { Ruma } from "../target/types/ruma";
import { BanksClient, ProgramTestContext, startAnchor } from "solana-bankrun";
import { BankrunProvider } from "anchor-bankrun";
import { BN, Program, web3 } from "@coral-xyz/anchor";
import IDL from "../target/idl/ruma.json";
import { createAvatar, Style } from "@dicebear/core";
import { icons, rings, shapes } from "@dicebear/collection";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mockStorage } from "@metaplex-foundation/umi-storage-mock";
import { createGenericFile, generateSigner } from "@metaplex-foundation/umi";
import { findMasterEditionPda, findMetadataPda, MPL_TOKEN_METADATA_PROGRAM_ID, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
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

  const organizer = web3.Keypair.generate();
  const attendee = web3.Keypair.generate();

  // devnet connection is only used for uploading images
  const umi = createUmi(web3.clusterApiUrl("devnet"))
    .use(mockStorage())

  let context: ProgramTestContext;
  let provider: BankrunProvider;
  let client: BanksClient;
  let program: Program<Ruma>;
  let organizerUserPDA: web3.PublicKey;
  let eventPDA: web3.PublicKey;
  let optionalEventPDA: web3.PublicKey;

  beforeAll(async () => {
    context = await startAnchor("",
      [
        {
          name: "mpl_token_metadata",
          programId: new web3.PublicKey(MPL_TOKEN_METADATA_PROGRAM_ID),
        }
      ],
      [
        {
          address: organizer.publicKey,
          info: {
            lamports: 5_000_000_000,
            data: Buffer.alloc(0),
            owner: web3.SystemProgram.programId,
            executable: false
          }
        },
        {
          address: attendee.publicKey,
          info: {
            lamports: 5_000_000_000,
            data: Buffer.alloc(0),
            owner: web3.SystemProgram.programId,
            executable: false
          }
        }
      ]
    );
    provider = new BankrunProvider(context);
    client = context.banksClient;
    program = new Program(IDL as Ruma, provider);
  })

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

    const [pda, organizerUserBump] = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("user"),
        organizer.publicKey.toBuffer()
      ],
      program.programId
    );

    organizerUserPDA = pda;

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

    const attendeeName = "Bob";
    const attendeeImage = await generateAvatarUri(shapes, "attendeeImage", attendee.publicKey.toBase58());

    await program.methods
      .createProfile(attendeeName, attendeeImage)
      .accounts({
        payer: attendee.publicKey,
      })
      .signers([attendee])
      .rpc();

    const [attendeeUserPDA, attendeeUserBump] = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("user"),
        attendee.publicKey.toBuffer()
      ],
      program.programId
    );

    const [attendeeUserDataPDA, attendeeUserDataBump] = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("user_data"),
        attendee.publicKey.toBuffer()
      ],
      program.programId
    );

    const attendeeUserAcc = await program.account.user.fetch(attendeeUserPDA);

    expect(attendeeUserAcc.bump).toEqual(attendeeUserBump);
    expect(attendeeUserAcc.data).toEqual(attendeeUserDataPDA);
    expect(attendeeUserAcc.badges).toEqual([]);

    const attendeeUserDataAcc = await program.account.userData.fetch(attendeeUserDataPDA);

    expect(attendeeUserDataAcc.bump).toEqual(attendeeUserDataBump);
    expect(attendeeUserDataAcc.name).toEqual(attendeeName);
    expect(attendeeUserDataAcc.image).toEqual(attendeeImage);
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
    const maxSupply = 100;

    const umiMint = generateSigner(umi);
    const web3Mint = web3.Keypair.fromSecretKey(umiMint.secretKey);

    const [metadata] = findMetadataPda(umi, { mint: umiMint.publicKey });
    const [edition] = findMasterEditionPda(umi, { mint: umiMint.publicKey });

    await program.methods
      .createBadge(
        badgeName,
        badgeSymbol,
        badgeUri,
        maxSupply
      )
      .accounts({
        payer: organizer.publicKey,
        event: eventPDA,
        mint: web3Mint.publicKey,
        metadata,
        edition,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([organizer, web3Mint])
      .rpc();

    const eventAcc = await program.account.event.fetch(eventPDA);

    expect(eventAcc.badge.toBase58()).toEqual(edition);

    const metadataAcc = await client.getAccount(new web3.PublicKey(metadata));
    
    expect(metadataAcc).not.toBeNull();
    
    const editionAcc = await client.getAccount(new web3.PublicKey(edition));
    
    expect(editionAcc).not.toBeNull();
  })

  test("creates a badge without max supply", async () => {
    const badgeName = "BadgeB";
    const badgeSymbol = "BDG";
    const badgeUri = await generateAvatarUri(rings, "badgeUri");

    const umiMint = generateSigner(umi);
    const web3Mint = web3.Keypair.fromSecretKey(umiMint.secretKey);

    const [metadata] = findMetadataPda(umi, { mint: umiMint.publicKey });
    const [edition] = findMasterEditionPda(umi, { mint: umiMint.publicKey });

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
        mint: web3Mint.publicKey,
        metadata,
        edition,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([organizer, web3Mint])
      .rpc();

    const eventAcc = await program.account.event.fetch(optionalEventPDA);

    expect(eventAcc.badge.toBase58()).toEqual(edition);

    const metadataAcc = await client.getAccount(new web3.PublicKey(metadata));
    
    expect(metadataAcc).not.toBeNull();
    
    const editionAcc = await client.getAccount(new web3.PublicKey(edition));
    
    expect(editionAcc).not.toBeNull();
  })
})
