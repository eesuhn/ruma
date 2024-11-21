import { describe, test } from 'bun:test';
import {
  changeAttendeeStatus,
  checkIntoEvent,
  createBadge,
  createEvent,
  createProfile,
  generateAvatarUri,
  getAttendeePdaAndBump,
  getEventPdaAndBump,
  getFundedKeypair,
  getUserPdaAndBump,
  registerForEvent,
  umi,
} from './utils';
import { icons, rings, shapes } from '@dicebear/collection';
import { BN } from 'bn.js';
import { Keypair, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import {
  findMasterEditionPda,
  findMetadataPda,
} from '@metaplex-foundation/mpl-token-metadata';
import { fromWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters';

describe('end-to-end', () => {
  test('ruma', async () => {
    const organizer = await getFundedKeypair();

    await createProfile(
      organizer,
      'Bob',
      await generateAvatarUri(shapes, organizer.publicKey.toBase58())
    );

    const eventName = 'Test event';
    const capacity = 10;

    await createEvent(
      organizer,
      true,
      true,
      eventName,
      await generateAvatarUri(icons),
      capacity,
      new BN(Date.now()),
      new BN(Date.now() + 1000 * 60 * 60 * 24),
      'Sunway University, Subang Jaya',
      'This is a test event'
    );

    const masterMint = Keypair.generate();
    const [organizerUserPda] = getUserPdaAndBump(organizer.publicKey);
    const [eventPda] = getEventPdaAndBump(organizerUserPda, eventName);
    const badgeName = 'Test badge';
    const badgeSymbol = 'BDG';
    const badgeUri = await generateAvatarUri(rings, 'uri');
    // corresponds to capacity of event
    const maxSupply = capacity;

    await createBadge(
      organizer,
      masterMint,
      eventPda,
      badgeName,
      badgeSymbol,
      badgeUri,
      new BN(maxSupply)
    );

    const registrant = await getFundedKeypair();

    await createProfile(
      registrant,
      'Paul',
      await generateAvatarUri(shapes, registrant.publicKey.toBase58())
    );

    const [registrantUserPda] = getUserPdaAndBump(registrant.publicKey);

    await registerForEvent(organizerUserPda, registrantUserPda, eventName);

    const newStatus = { approved: {} };

    await changeAttendeeStatus(registrantUserPda, eventPda, newStatus);

    const editionMint = Keypair.generate();
    const [attendeePda] = getAttendeePdaAndBump(registrantUserPda, eventPda);
    const masterAtaPda = getAssociatedTokenAddressSync(
      masterMint.publicKey,
      organizerUserPda,
      true
    );
    const [masterMetadataPda] = findMetadataPda(umi, {
      mint: fromWeb3JsPublicKey(masterMint.publicKey),
    });
    const [masterEditionPda] = findMasterEditionPda(umi, {
      mint: fromWeb3JsPublicKey(masterMint.publicKey),
    });

    await checkIntoEvent(
      organizer,
      editionMint,
      registrantUserPda,
      attendeePda,
      masterMint.publicKey,
      masterAtaPda,
      new PublicKey(masterMetadataPda),
      new PublicKey(masterEditionPda)
    );
  });
});
