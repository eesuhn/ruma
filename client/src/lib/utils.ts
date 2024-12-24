import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { createAvatar } from '@dicebear/core';
import { bigSmile, shapes, rings } from '@dicebear/collection';

type AvatarStyle = 'profile' | 'event' | 'badge';

interface DicebearProps {
  seed: string;
  style: AvatarStyle;
}

const styleMap = {
  profile: bigSmile,
  event: shapes,
  badge: rings,
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a Dicebear SVG based on the seed and style
 *
 * @param {DicebearProps} seed
 * @param {DicebearProps} style 'profile' | 'event' | 'badge'
 * @returns {string} svg
 */
export function generateDicebear({ seed, style }: DicebearProps): string {
  return createAvatar(styleMap[style], {
    seed,
  }).toString();
}
