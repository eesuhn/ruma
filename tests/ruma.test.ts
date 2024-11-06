import { beforeAll, describe, expect, test } from "bun:test";
import { Ruma } from "../target/types/ruma";
import { ProgramTestContext, startAnchor } from "solana-bankrun";
import { BankrunProvider } from "anchor-bankrun";
import { Program, web3 } from "@coral-xyz/anchor";
import IDL from "../target/idl/ruma.json";
import { createAvatar } from "@dicebear/core";
import { shapes } from "@dicebear/collection";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mockStorage } from "@metaplex-foundation/umi-storage-mock";
import { createGenericFile } from "@metaplex-foundation/umi";

describe("ruma", () => {
  const organizer = web3.Keypair.generate();
  const attendee = web3.Keypair.generate();

  const umi = createUmi(web3.clusterApiUrl("devnet"))
    .use(mockStorage())

  let context: ProgramTestContext;
  let provider: BankrunProvider;
  let payer: web3.Keypair;
  let program: Program<Ruma>;

  beforeAll(async () => {
    context = await startAnchor("", [], [
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
    ]);
    provider = new BankrunProvider(context);
    payer = context.payer;
    program = new Program(IDL as Ruma, provider);
  })

  test("creates profiles", async () => {
    const shapeA = createAvatar(shapes, {
      seed: organizer.publicKey.toBase58(),
      flip: Math.random() >= 0.5,
      rotate: Math.random() * 360,
    });

    const fileA = createGenericFile(
      shapeA.toDataUri(),
      "shapeA",
      {
        contentType: "image/svg+xml",
      }
    );

    const [uriA] = await umi.uploader.upload([fileA]);

    const organizerProfile = {
      name: "Jeff",
      image: uriA
    };

    await program.methods
      .createProfile(organizerProfile)
      .accounts({
        payer: organizer.publicKey,
      })
      .signers([organizer])
      .rpc();

    const [organizerUserPDA] = web3.PublicKey.findProgramAddressSync([Buffer.from("user_data"), organizer.publicKey.toBuffer()], program.programId);

    const organizerUserAcc = await program.account.user.fetch(organizerUserPDA);

    expect(organizerUserAcc.data.name).toEqual(organizerProfile.name);
    expect(organizerUserAcc.data.image).toEqual(organizerProfile.image);

    const shapeB = createAvatar(shapes, {
      seed: organizer.publicKey.toBase58(),
      flip: Math.random() >= 0.5,
      rotate: Math.random() * 360,
    });

    const fileB = createGenericFile(
      shapeB.toDataUri(),
      "shapeB",
      {
        contentType: "image/svg+xml",
      }
    );

    const [uriB] = await umi.uploader.upload([fileB]);

    const attendeeProfile = {
      name: "Bob",
      image: uriB
    };

    await program.methods
      .createProfile(attendeeProfile)
      .accounts({
        payer: attendee.publicKey,
      })
      .signers([attendee])
      .rpc();

    const [attendeeUserPDA] = web3.PublicKey.findProgramAddressSync([Buffer.from("user_data"), attendee.publicKey.toBuffer()], program.programId);

    const attendeeUserAcc = await program.account.user.fetch(attendeeUserPDA);

    expect(attendeeUserAcc.data.name).toEqual(attendeeProfile.name);
    expect(attendeeUserAcc.data.image).toEqual(attendeeProfile.image);
  })
})
