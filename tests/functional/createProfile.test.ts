import { describe, expect, test } from "bun:test";
import { createProfile, generateAvatarUri, getFundedKeypair, getUserDataPdaAndBump, getUserPdaAndBump, program } from "../utils";
import { shapes } from "@dicebear/collection";
import { AnchorError } from "@coral-xyz/anchor";

describe("createProfile", () => {
  test("creates a profile", async () => {
    const organizer = await getFundedKeypair();
    const organizerName = "Jeff";
    const organizerImage = await generateAvatarUri(shapes, organizer.publicKey.toBase58());

    const { userAcc, userDataAcc } = await createProfile(
      organizer,
      organizerName,
      organizerImage,
    )

    const [organizerUserPda, organizerUserBump] = getUserPdaAndBump(organizer.publicKey);
    const [organizerUserDataPda, organizerUserDataBump] = getUserDataPdaAndBump(organizerUserPda);

    expect(userAcc.bump).toEqual(organizerUserBump);
    expect(userAcc.data).toEqual(organizerUserDataPda);
    expect(userAcc.badges).toEqual([]);
    expect(userDataAcc.bump).toEqual(organizerUserDataBump);
    expect(userDataAcc.name).toEqual(organizerName);
    expect(userDataAcc.image).toEqual(organizerImage);
  });

  test("throws when creating a profile with empty name", async () => {
    const organizer = await getFundedKeypair();
    const organizerName = "";
    const organizerImage = await generateAvatarUri(shapes, organizer.publicKey.toBase58());

    try {
      await createProfile(
        organizer,
        organizerName,
        organizerImage,
      )
    } catch (err) {
      expect(err).toBeInstanceOf(AnchorError);
      expect(err.error.errorCode.code).toEqual("UserNameRequired");
      expect(err.error.errorCode.number).toEqual(6000);
    }
  });

  test("throws when creating a profile with name that exceeds max length", async () => {
    const organizer = await getFundedKeypair();
    const organizerImage = await generateAvatarUri(shapes, organizer.publicKey.toBase58());
    const userNameMaxLength = 32;

    try {
      await createProfile(
        organizer,
        "_".repeat(userNameMaxLength + 1),
        organizerImage,
      )
    } catch (err) {
      expect(err).toBeInstanceOf(AnchorError);
      expect(err.error.errorCode.code).toEqual("UserNameTooLong");
      expect(err.error.errorCode.number).toEqual(6001);
    }
  })

  test("throws when creating a profile with empty image", async () => {
    const organizer = await getFundedKeypair();
    const organizerName = "Jeff";
    const organizerImage = "";

    try {
      await createProfile(
        organizer,
        organizerName,
        organizerImage
      )
    } catch (err) {
      expect(err).toBeInstanceOf(AnchorError);
      expect(err.error.errorCode.code).toEqual("UserImageRequired");
      expect(err.error.errorCode.number).toEqual(6002);
    }
  })

  test("throws when creating a profile with image that exceeds max length", async () => {
    const organizer = await getFundedKeypair();
    const organizerName = "Bob";
    const userImageMaxLength = 200;

    try {
      await createProfile(
        organizer,
        organizerName,
        "_".repeat(userImageMaxLength + 1)
      )
    } catch (err) {
      expect(err).toBeInstanceOf(AnchorError);
      expect(err.error.errorCode.code).toEqual("UserImageTooLong");
      expect(err.error.errorCode.number).toEqual(6003);
    }
  })
})