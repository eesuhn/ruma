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

/**
 * Validate image file or SVG string (from Dicebear)
 *
 * @param value
 * @returns
 */
function validateImage(value: string | File) {
  if (typeof value === 'string' && value.includes('<svg')) {
    // If it's an SVG string (from Dicebear)
    return true;
  }
  if (value instanceof File) {
    // If it's a File object and file size below MAX_FILE_SIZE
    return validateFileSize(value.size) && validateFileType(value.type);
  }
  return false;
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
    .refine(validateImage, {
      message: `Invalid image. Must be a valid file type (${ACCEPTED_IMAGE_TYPES.join(', ')}) and less than ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
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
    .refine(validateImage, {
      message: `Invalid image. Must be a valid file type (${ACCEPTED_IMAGE_TYPES.join(', ')}) and less than ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
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
    .refine(validateImage, {
      message: `Invalid image. Must be a valid file type (${ACCEPTED_IMAGE_TYPES.join(', ')}) and less than ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
    })
    .optional(),
});
