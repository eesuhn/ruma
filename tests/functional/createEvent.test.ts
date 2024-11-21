import { BN } from 'bn.js';
import { describe, expect, test } from 'bun:test';
import {
  createEvent,
  createProfile,
  generateAvatarUri,
  getEventDataPdaAndBump,
  getEventPdaAndBump,
  getFundedKeypair,
  getUserPdaAndBump,
} from '../utils';
import { icons, shapes } from '@dicebear/collection';
import { AnchorError } from '@coral-xyz/anchor';

describe('createEvent', () => {
  test('creates an event', async () => {
    const organizer = await getFundedKeypair();

    await createProfile(
      organizer,
      'Zack',
      await generateAvatarUri(shapes, organizer.publicKey.toBase58())
    );

    const isPublic = true;
    const needsApproval = true;
    const eventName = 'Test event';
    const eventImage = await generateAvatarUri(icons);
    const capacity = 10;
    const startTimestamp = new BN(Date.now());
    // 24 hours after start
    const endTimestamp = new BN(Date.now() + 1000 * 60 * 60 * 24);
    const location = 'Sunway University, Subang Jaya';
    const about = 'This is a test event';

    const { eventAcc, eventDataAcc } = await createEvent(
      organizer,
      isPublic,
      needsApproval,
      eventName,
      eventImage,
      capacity,
      startTimestamp,
      endTimestamp,
      location,
      about
    );

    const [organizerUserPda] = getUserPdaAndBump(organizer.publicKey);
    const [eventPda, eventBump] = getEventPdaAndBump(
      organizerUserPda,
      eventName
    );
    const [eventDataPda, eventDataBump] = getEventDataPdaAndBump(eventPda);

    expect(eventAcc.bump).toEqual(eventBump);
    expect(eventAcc.badge).toEqual(null);
    expect(eventAcc.data).toEqual(eventDataPda);
    expect(eventAcc.attendees).toEqual([]);
    expect(eventDataAcc.bump).toEqual(eventDataBump);
    expect(eventDataAcc.isPublic).toEqual(isPublic);
    expect(eventDataAcc.needsApproval).toEqual(needsApproval);
    expect(eventDataAcc.name).toEqual(eventName);
    expect(eventDataAcc.image).toEqual(eventImage);
    expect(eventDataAcc.capacity).toEqual(capacity);
    expect(eventDataAcc.startTimestamp).toEqual(startTimestamp);
    expect(eventDataAcc.endTimestamp).toEqual(endTimestamp);
    expect(eventDataAcc.location).toEqual(location);
    expect(eventDataAcc.about).toEqual(about);
  });

  test('creates an event with optional values', async () => {
    const organizer = await getFundedKeypair();

    await createProfile(
      organizer,
      'Bob',
      await generateAvatarUri(shapes, organizer.publicKey.toBase58())
    );

    const isPublic = true;
    const needsApproval = true;
    const eventName = 'Test event';
    const eventImage = await generateAvatarUri(icons);
    const capacity = null;
    const startTimestamp = null;
    const endTimestamp = null;
    const location = null;
    const about = null;

    const { eventAcc, eventDataAcc } = await createEvent(
      organizer,
      isPublic,
      needsApproval,
      eventName,
      eventImage,
      capacity,
      startTimestamp,
      endTimestamp,
      location,
      about
    );

    const [organizerUserPda] = getUserPdaAndBump(organizer.publicKey);
    const [eventPda, eventBump] = getEventPdaAndBump(
      organizerUserPda,
      eventName
    );
    const [eventDataPda, eventDataBump] = getEventDataPdaAndBump(eventPda);

    expect(eventAcc.bump).toEqual(eventBump);
    expect(eventAcc.badge).toEqual(null);
    expect(eventAcc.data).toEqual(eventDataPda);
    expect(eventAcc.attendees).toEqual([]);
    expect(eventDataAcc.bump).toEqual(eventDataBump);
    expect(eventDataAcc.isPublic).toEqual(isPublic);
    expect(eventDataAcc.needsApproval).toEqual(needsApproval);
    expect(eventDataAcc.name).toEqual(eventName);
    expect(eventDataAcc.image).toEqual(eventImage);
    expect(eventDataAcc.capacity).toEqual(capacity);
    expect(eventDataAcc.startTimestamp).toEqual(startTimestamp);
    expect(eventDataAcc.endTimestamp).toEqual(endTimestamp);
    expect(eventDataAcc.location).toEqual(location);
    expect(eventDataAcc.about).toEqual(about);
  });

  test('throws when creating an event with empty name', async () => {
    const organizer = await getFundedKeypair();

    await createProfile(
      organizer,
      'Bob',
      await generateAvatarUri(shapes, organizer.publicKey.toBase58())
    );

    const isPublic = true;
    const needsApproval = true;
    const eventName = '';
    const eventImage = await generateAvatarUri(icons);
    const capacity = 10;
    const startTimestamp = new BN(Date.now());
    // 24 hours after start
    const endTimestamp = new BN(Date.now() + 1000 * 60 * 60 * 24);
    const location = 'Sunway University, Subang Jaya';
    const about = 'This is a test event';

    try {
      await createEvent(
        organizer,
        isPublic,
        needsApproval,
        eventName,
        eventImage,
        capacity,
        startTimestamp,
        endTimestamp,
        location,
        about
      );
    } catch (err) {
      expect(err).toBeInstanceOf(AnchorError);
      expect(err.error.errorCode.code).toEqual('EventNameRequired');
      expect(err.error.errorCode.number).toEqual(6004);
    }
  });

  test('throws when creating an event with a name that exceeds max length', async () => {
    const organizer = await getFundedKeypair();

    await createProfile(
      organizer,
      'Bob',
      await generateAvatarUri(shapes, organizer.publicKey.toBase58())
    );

    const isPublic = true;
    const needsApproval = true;
    const eventNameMaxLength = 128;
    const eventName = '_'.repeat(eventNameMaxLength + 1);
    const eventImage = await generateAvatarUri(icons);
    const capacity = 10;
    const startTimestamp = new BN(Date.now());
    // 24 hours after start
    const endTimestamp = new BN(Date.now() + 1000 * 60 * 60 * 24);
    const location = 'Sunway University, Subang Jaya';
    const about = 'This is a test event';

    expect(async () => {
      await createEvent(
        organizer,
        isPublic,
        needsApproval,
        eventName,
        eventImage,
        capacity,
        startTimestamp,
        endTimestamp,
        location,
        about
      );
    }).toThrow();
  });

  test('throws when creating an event with empty image', async () => {
    const organizer = await getFundedKeypair();

    await createProfile(
      organizer,
      'Bob',
      await generateAvatarUri(shapes, organizer.publicKey.toBase58())
    );

    const isPublic = true;
    const needsApproval = true;
    const eventName = 'Test event';
    const eventImage = '';
    const capacity = 10;
    const startTimestamp = new BN(Date.now());
    // 24 hours after start
    const endTimestamp = new BN(Date.now() + 1000 * 60 * 60 * 24);
    const location = 'Sunway University, Subang Jaya';
    const about = 'This is a test event';

    try {
      await createEvent(
        organizer,
        isPublic,
        needsApproval,
        eventName,
        eventImage,
        capacity,
        startTimestamp,
        endTimestamp,
        location,
        about
      );
    } catch (err) {
      expect(err).toBeInstanceOf(AnchorError);
      expect(err.error.errorCode.code).toEqual('EventImageRequired');
      expect(err.error.errorCode.number).toEqual(6006);
    }
  });

  test('throws when creating an event with a image that exceeds max length', async () => {
    const organizer = await getFundedKeypair();

    await createProfile(
      organizer,
      'Bob',
      await generateAvatarUri(shapes, organizer.publicKey.toBase58())
    );

    const isPublic = true;
    const needsApproval = true;
    const eventName = 'Test event';
    const eventImageMaxLength = 200;
    const eventImage = '_'.repeat(eventImageMaxLength + 1);
    const capacity = 10;
    const startTimestamp = new BN(Date.now());
    // 24 hours after start
    const endTimestamp = new BN(Date.now() + 1000 * 60 * 60 * 24);
    const location = 'Sunway University, Subang Jaya';
    const about = 'This is a test event';

    try {
      await createEvent(
        organizer,
        isPublic,
        needsApproval,
        eventName,
        eventImage,
        capacity,
        startTimestamp,
        endTimestamp,
        location,
        about
      );
    } catch (err) {
      expect(err).toBeInstanceOf(AnchorError);
      expect(err.error.errorCode.code).toEqual('EventImageTooLong');
      expect(err.error.errorCode.number).toEqual(6007);
    }
  });
});
