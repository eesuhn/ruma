import { describe, expect, test } from 'bun:test';
import {
  changeAttendeeStatus,
  createBadge,
  createEvent,
  createProfile,
  generateAvatarUri,
  getEventPdaAndBump,
  getFundedKeypair,
  getUserPdaAndBump,
  registerForEvent,
} from '../utils';
import { icons, rings, shapes } from '@dicebear/collection';
import { BN } from 'bn.js';
import { Keypair } from '@solana/web3.js';
import { AnchorError } from '@coral-xyz/anchor';

describe('changeAttendeeStatus', () => {
  test('changing attendee status', async () => {
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

    const { attendeeAcc } = await changeAttendeeStatus(
      registrantUserPda,
      eventPda,
      newStatus
    );

    expect(attendeeAcc.status).toEqual(newStatus);
  });

  test('throws when changing status of user that has not registered', async () => {
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
    const newStatus = { approved: {} };

    try {
      await changeAttendeeStatus(registrantUserPda, eventPda, newStatus);
    } catch (err) {
      expect(err).toBeInstanceOf(AnchorError);
      expect(err.error.errorCode.code).toEqual('AccountNotInitialized');
      expect(err.error.errorCode.number).toEqual(3012);
      expect(err.error.origin).toEqual('attendee');
    }
  });
});
