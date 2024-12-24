import { beforeEach, describe, expect, test } from 'bun:test';
import { AnchorError, BN } from '@coral-xyz/anchor';
import { Keypair } from '@solana/web3.js';
import { getFundedKeypair, program } from '../utils';
import { createEvent, createProfile } from '../methods';
import {
  getEventDataPdaAndBump,
  getEventPdaAndBump,
  getUserPdaAndBump,
} from '../pda';
import { MAX_EVENT_IMAGE_LENGTH, MAX_EVENT_NAME_LENGTH } from '../constants';

describe('createEvent', () => {
  let organizer: Keypair;

  beforeEach(async () => {
    organizer = await getFundedKeypair();

    await createProfile(
      program,
      'Zack',
      'https://example.com/image.png',
      organizer
    );
  });

  test('creates an event', async () => {
    const isPublic = true;
    const needsApproval = true;
    const eventName = 'Test event';
    const eventImage = 'https://example.com/image.png';
    const capacity = 10;
    const startTimestamp = new BN(Date.now());
    // 24 hours after start
    const endTimestamp = new BN(Date.now() + 1000 * 60 * 60 * 24);
    const location = 'Sunway University, Subang Jaya';
    const about = 'This is a test event';

    const { eventAcc, eventDataAcc } = await createEvent(
      program,
      isPublic,
      needsApproval,
      eventName,
      eventImage,
      capacity,
      startTimestamp,
      endTimestamp,
      location,
      about,
      organizer
    );

    const [organizerUserPda] = getUserPdaAndBump(organizer.publicKey);
    const [eventPda, eventBump] = getEventPdaAndBump(
      organizerUserPda,
      eventName
    );
    const [eventDataPda, eventDataBump] = getEventDataPdaAndBump(eventPda);

    expect(eventAcc.bump).toEqual(eventBump);
    expect(eventAcc.organizer).toEqual(organizerUserPda);
    expect(eventAcc.data).toEqual(eventDataPda);
    expect(eventAcc.badge).toEqual(null);
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
    const isPublic = true;
    const needsApproval = true;
    const eventName = 'Test event';
    const eventImage = 'https://example.com/image.png';
    const capacity = null;
    const startTimestamp = null;
    const endTimestamp = null;
    const location = null;
    const about = null;

    const { eventAcc, eventDataAcc } = await createEvent(
      program,
      isPublic,
      needsApproval,
      eventName,
      eventImage,
      capacity,
      startTimestamp,
      endTimestamp,
      location,
      about,
      organizer
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
    const isPublic = true;
    const needsApproval = true;
    const eventName = '';
    const eventImage = 'https://example.com/image.png';
    const capacity = 10;
    const startTimestamp = new BN(Date.now());
    // 24 hours after start
    const endTimestamp = new BN(Date.now() + 1000 * 60 * 60 * 24);
    const location = 'Sunway University, Subang Jaya';
    const about = 'This is a test event';

    try {
      await createEvent(
        program,
        isPublic,
        needsApproval,
        eventName,
        eventImage,
        capacity,
        startTimestamp,
        endTimestamp,
        location,
        about,
        organizer
      );
    } catch (err) {
      expect(err).toBeInstanceOf(AnchorError);
      expect(err.error.errorCode.code).toEqual('EventNameRequired');
      expect(err.error.errorCode.number).toEqual(6004);
    }
  });

  test('throws when creating an event with a name that exceeds max length', async () => {
    const isPublic = true;
    const needsApproval = true;
    const eventName = '_'.repeat(MAX_EVENT_NAME_LENGTH + 1);
    const eventImage = 'https://example.com/image.png';
    const capacity = 10;
    const startTimestamp = new BN(Date.now());
    // 24 hours after start
    const endTimestamp = new BN(Date.now() + 1000 * 60 * 60 * 24);
    const location = 'Sunway University, Subang Jaya';
    const about = 'This is a test event';

    expect(async () => {
      await createEvent(
        program,
        isPublic,
        needsApproval,
        eventName,
        eventImage,
        capacity,
        startTimestamp,
        endTimestamp,
        location,
        about,
        organizer
      );
    }).toThrow();
  });

  test('throws when creating an event with empty image', async () => {
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
        program,
        isPublic,
        needsApproval,
        eventName,
        eventImage,
        capacity,
        startTimestamp,
        endTimestamp,
        location,
        about,
        organizer
      );
    } catch (err) {
      expect(err).toBeInstanceOf(AnchorError);
      expect(err.error.errorCode.code).toEqual('EventImageRequired');
      expect(err.error.errorCode.number).toEqual(6006);
    }
  });

  test('throws when creating an event with a image that exceeds max length', async () => {
    const isPublic = true;
    const needsApproval = true;
    const eventName = 'Test event';
    const eventImage = '_'.repeat(MAX_EVENT_IMAGE_LENGTH + 1);
    const capacity = 10;
    const startTimestamp = new BN(Date.now());
    // 24 hours after start
    const endTimestamp = new BN(Date.now() + 1000 * 60 * 60 * 24);
    const location = 'Sunway University, Subang Jaya';
    const about = 'This is a test event';

    try {
      await createEvent(
        program,
        isPublic,
        needsApproval,
        eventName,
        eventImage,
        capacity,
        startTimestamp,
        endTimestamp,
        location,
        about,
        organizer
      );
    } catch (err) {
      expect(err).toBeInstanceOf(AnchorError);
      expect(err.error.errorCode.code).toEqual('EventImageTooLong');
      expect(err.error.errorCode.number).toEqual(6007);
    }
  });
});
