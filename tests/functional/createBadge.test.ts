import { describe, expect, test } from 'bun:test';
import {
  createBadge,
  createEvent,
  createProfile,
  generateAvatarUri,
  getEventPdaAndBump,
  getFundedKeypair,
  getUserPdaAndBump,
} from '../utils';
import { icons, rings, shapes } from '@dicebear/collection';
import { BN } from 'bn.js';
import { Keypair, SendTransactionError } from '@solana/web3.js';
import { AnchorError } from '@coral-xyz/anchor';

describe('createBadge', () => {
  test('creates a badge with max supply', async () => {
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

    const { metadataAcc, masterEditionAcc, eventAcc, masterTokenAcc } =
      await createBadge(
        organizer,
        masterMint,
        eventPda,
        badgeName,
        badgeSymbol,
        badgeUri,
        new BN(maxSupply)
      );

    expect(metadataAcc.name).toEqual(badgeName);
    expect(metadataAcc.symbol).toEqual(badgeSymbol);
    expect(metadataAcc.uri).toEqual(badgeUri);
    // @ts-ignore
    expect(metadataAcc.creators.value[0].address).toEqual(
      organizerUserPda.toBase58()
    );
    // @ts-ignore
    expect(Number(masterEditionAcc.maxSupply.value)).toEqual(maxSupply);
    expect(Number(masterEditionAcc.supply)).toEqual(0);
    expect(eventAcc.badge).toEqual(masterMint.publicKey);
    expect(Number(masterTokenAcc.amount)).toEqual(1);
  });

  test('creates a badge without max supply', async () => {
    const organizer = await getFundedKeypair();

    await createProfile(
      organizer,
      'Bob',
      await generateAvatarUri(shapes, organizer.publicKey.toBase58())
    );

    const eventName = 'Test event';
    const capacity = null;

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

    const { metadataAcc, masterEditionAcc, eventAcc, masterTokenAcc } =
      await createBadge(
        organizer,
        masterMint,
        eventPda,
        badgeName,
        badgeSymbol,
        badgeUri,
        maxSupply
      );

    expect(metadataAcc.name).toEqual(badgeName);
    expect(metadataAcc.symbol).toEqual(badgeSymbol);
    expect(metadataAcc.uri).toEqual(badgeUri);
    // @ts-ignore
    expect(metadataAcc.creators.value[0].address).toEqual(
      organizerUserPda.toBase58()
    );
    // @ts-ignore
    expect(masterEditionAcc.maxSupply.value).toEqual(undefined);
    expect(Number(masterEditionAcc.supply)).toEqual(0);
    expect(eventAcc.badge).toEqual(masterMint.publicKey);
    expect(Number(masterTokenAcc.amount)).toEqual(1);
  });

  test('throws when creating a badge with empty name', async () => {
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
    const badgeName = '';
    const badgeSymbol = 'BDG';
    const badgeUri = await generateAvatarUri(rings, 'uri');
    // corresponds to capacity of event
    const maxSupply = capacity;

    try {
      await createBadge(
        organizer,
        masterMint,
        eventPda,
        badgeName,
        badgeSymbol,
        badgeUri,
        new BN(maxSupply)
      );
    } catch (err) {
      expect(err).toBeInstanceOf(AnchorError);
      expect(err.error.errorCode.code).toEqual('BadgeNameRequired');
      expect(err.error.errorCode.number).toEqual(6008);
    }
  });

  test('throws when creating a badge with a name that exceeds max length', async () => {
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
    const badgeNameMaxLength = 32;
    const badgeName = '_'.repeat(badgeNameMaxLength + 1);
    const badgeSymbol = 'BDG';
    const badgeUri = await generateAvatarUri(rings, 'uri');
    // corresponds to capacity of event
    const maxSupply = capacity;

    try {
      await createBadge(
        organizer,
        masterMint,
        eventPda,
        badgeName,
        badgeSymbol,
        badgeUri,
        new BN(maxSupply)
      );
    } catch (err) {
      expect(err).toBeInstanceOf(AnchorError);
      expect(err.error.errorCode.code).toEqual('BadgeNameTooLong');
      expect(err.error.errorCode.number).toEqual(6009);
    }
  });

  test('throws when creating a badge with empty symbol', async () => {
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
    const badgeSymbol = '';
    const badgeUri = await generateAvatarUri(rings, 'uri');
    // corresponds to capacity of event
    const maxSupply = capacity;

    try {
      await createBadge(
        organizer,
        masterMint,
        eventPda,
        badgeName,
        badgeSymbol,
        badgeUri,
        new BN(maxSupply)
      );
    } catch (err) {
      expect(err).toBeInstanceOf(AnchorError);
      expect(err.error.errorCode.code).toEqual('BadgeSymbolRequired');
      expect(err.error.errorCode.number).toEqual(6010);
    }
  });

  test('throws when creating a badge with a symbol that exceeds max length', async () => {
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
    const badgeSymbolMaxLength = 10;
    const badgeSymbol = '_'.repeat(badgeSymbolMaxLength + 1);
    const badgeUri = await generateAvatarUri(rings, 'uri');
    // corresponds to capacity of event
    const maxSupply = capacity;

    try {
      await createBadge(
        organizer,
        masterMint,
        eventPda,
        badgeName,
        badgeSymbol,
        badgeUri,
        new BN(maxSupply)
      );
    } catch (err) {
      expect(err).toBeInstanceOf(AnchorError);
      expect(err.error.errorCode.code).toEqual('BadgeSymbolTooLong');
      expect(err.error.errorCode.number).toEqual(6011);
    }
  });

  test('throws when creating a badge with empty URI', async () => {
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
    const badgeUri = '';
    // corresponds to capacity of event
    const maxSupply = capacity;

    try {
      await createBadge(
        organizer,
        masterMint,
        eventPda,
        badgeName,
        badgeSymbol,
        badgeUri,
        new BN(maxSupply)
      );
    } catch (err) {
      expect(err).toBeInstanceOf(AnchorError);
      expect(err.error.errorCode.code).toEqual('BadgeUriRequired');
      expect(err.error.errorCode.number).toEqual(6012);
    }
  });

  test('throws when creating a badge with a URI that exceeds max length', async () => {
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
    const badgeUriMaxLength = 200;
    const badgeUri = '_'.repeat(badgeUriMaxLength + 1);
    // corresponds to capacity of event
    const maxSupply = capacity;

    try {
      await createBadge(
        organizer,
        masterMint,
        eventPda,
        badgeName,
        badgeSymbol,
        badgeUri,
        new BN(maxSupply)
      );
    } catch (err) {
      expect(err).toBeInstanceOf(AnchorError);
      expect(err.error.errorCode.code).toEqual('BadgeUriTooLong');
      expect(err.error.errorCode.number).toEqual(6013);
    }
  });

  test('throws when creating an event badge when badge already exists', async () => {
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

    try {
      await createBadge(
        organizer,
        masterMint,
        eventPda,
        badgeName,
        badgeSymbol,
        badgeUri,
        new BN(maxSupply)
      );
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
});
