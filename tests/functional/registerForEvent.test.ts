import { describe, expect, test } from 'bun:test';
import {
  createBadge,
  createEvent,
  createProfile,
  generateAvatarUri,
  getAttendeePdaAndBump,
  getEventPdaAndBump,
  getFundedKeypair,
  getUserPdaAndBump,
  registerForEvent,
} from '../utils';
import { icons, rings, shapes } from '@dicebear/collection';
import { BN } from 'bn.js';
import { Keypair, SendTransactionError } from '@solana/web3.js';
import { AnchorError } from '@coral-xyz/anchor';

describe('registerForEvent', () => {
  test('registers for an event', async () => {
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

    const { eventAcc, attendeeAcc } = await registerForEvent(
      organizerUserPda,
      registrantUserPda,
      eventName
    );

    const [attendeePda, attendeeBump] = getAttendeePdaAndBump(
      registrantUserPda,
      eventPda
    );

    expect(attendeeAcc.bump).toEqual(attendeeBump);
    expect(attendeeAcc.status).toEqual({ pending: {} });
    expect(eventAcc.attendees[0]).toEqual(attendeePda);
  });

  test('throws when registering for the same event again', async () => {
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

    try {
      await registerForEvent(organizerUserPda, registrantUserPda, eventName);
    } catch (err) {
      expect(err).toBeInstanceOf(SendTransactionError);
      expect(err.logs).toEqual(
        expect.arrayContaining([
          expect.stringMatching(
            /Allocate: account Address \{[^}]+\} already in use/
          ),
        ])
      );
    }
  });

  test('throws when registering for a full event', async () => {
    const organizer = await getFundedKeypair();

    await createProfile(
      organizer,
      'Bob',
      await generateAvatarUri(shapes, organizer.publicKey.toBase58())
    );

    const eventName = 'Test event';
    const capacity = 1;

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

    try {
      await registerForEvent(organizerUserPda, registrantUserPda, eventName);
    } catch (err) {
      expect(err).toBeInstanceOf(AnchorError);
      expect(err.error.errorCode.code).toEqual('EventCapacityMaxReached');
      expect(err.error.errorCode.number).toEqual(6015);
    }
  });
});
