import { z } from 'zod';
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_BADGE_NAME_LENGTH,
  MAX_BADGE_SYMBOL_LENGTH,
  MAX_EVENT_NAME_LENGTH,
  MAX_FILE_SIZE,
  MAX_USER_NAME_LENGTH,
  MIN_BADGE_NAME_LENGTH,
  MIN_BADGE_SYMBOL_LENGTH,
  MIN_EVENT_NAME_LENGTH,
  MIN_USER_NAME_LENGTH,
} from './constants';

function validateFileSize(size: number) {
  return size <= MAX_FILE_SIZE;
}

function validateFileType(type: string) {
  return ACCEPTED_IMAGE_TYPES.includes(type);
}

export const createProfileFormSchema = z.object({
  name: z
    .string()
    .min(MIN_USER_NAME_LENGTH, {
      message: `Name must be at least ${MIN_USER_NAME_LENGTH} characters.`,
    })
    .max(MAX_USER_NAME_LENGTH, {
      message: `Name must be less than ${MAX_USER_NAME_LENGTH} characters.`,
    }),
  profileImage: z
    .any()
    .refine((file) => validateFileSize(file?.size), {
      message: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
    })
    .refine((file) => validateFileType(file?.type), {
      message: `File type must be ${ACCEPTED_IMAGE_TYPES.join(', ')}.`,
    })
    .optional(),
});

export const createEventFormSchema = z.object({
  eventName: z
    .string()
    .min(MIN_EVENT_NAME_LENGTH, {
      message: `Event name must be at least ${MIN_EVENT_NAME_LENGTH} characters.`,
    })
    .max(MAX_EVENT_NAME_LENGTH, {
      message: `Event name must be less than ${MAX_EVENT_NAME_LENGTH} characters.`,
    }),
  eventImage: z
    .any()
    .refine((file) => validateFileSize(file?.size), {
      message: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
    })
    .refine((file) => validateFileType(file?.type), {
      message: `File type must be ${ACCEPTED_IMAGE_TYPES.join(', ')}.`,
    })
    .optional(),
  visibility: z.string(),
  startDate: z.date().nullable(),
  endDate: z.date().nullable(),
  location: z.string().min(1, {
    message: 'Location is required.',
  }),
  about: z.string(),
  requireApproval: z.boolean().default(false),
  capacity: z.number().nullable(),
  badgeName: z
    .string()
    .min(MIN_BADGE_NAME_LENGTH, {
      message: `Badge name must be at least ${MIN_BADGE_NAME_LENGTH} characters.`,
    })
    .max(MAX_BADGE_NAME_LENGTH, {
      message: `Badge name must be less than ${MAX_BADGE_NAME_LENGTH} characters.`,
    }),
  badgeSymbol: z
    .string()
    .min(MIN_BADGE_SYMBOL_LENGTH, {
      message: `Badge symbol must be at least ${MIN_BADGE_SYMBOL_LENGTH} characters.`,
    })
    .max(MAX_BADGE_SYMBOL_LENGTH, {
      message: `Badge symbol must be less than ${MAX_BADGE_SYMBOL_LENGTH} characters.`,
    }),
  badgeImage: z
    .any()
    .refine((file) => validateFileSize(file?.size), {
      message: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
    })
    .refine((file) => validateFileType(file?.type), {
      message: `File type must be ${ACCEPTED_IMAGE_TYPES.join(', ')}.`,
    })
    .optional(),
});
