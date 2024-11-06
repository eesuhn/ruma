import { beforeAll, describe } from "bun:test";
import { Ruma } from "../target/types/ruma";
import { ProgramTestContext, startAnchor } from "solana-bankrun";
import { BankrunProvider } from "anchor-bankrun";
import { Program, web3 } from "@coral-xyz/anchor";
import IDL from "../target/idl/ruma.json";

describe("ruma", () => {
  const organizer = web3.Keypair.generate();
  const attendee = web3.Keypair.generate();

  let context: ProgramTestContext;
  let provider: BankrunProvider;
  let payer: web3.Keypair;
  let program: Program<Ruma>;

  beforeAll(async () => {
    context = await startAnchor("", [], []);
    provider = new BankrunProvider(context);
    payer = context.payer;
    program = new Program(IDL as Ruma, provider);
  })
})
