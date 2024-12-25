import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { createAvatar } from '@dicebear/core';
import { bigSmile, shapes, rings } from '@dicebear/collection';

interface DicebearProps {
  seed: string;
  style: 'profile' | 'event' | 'badge';
  output: 'svg' | 'uri';
}

const styleMap = {
  profile: bigSmile,
  event: shapes,
  badge: rings,
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a Dicebear SVG based on the seed and style
 *
 * @param {DicebearProps} seed
 * @param {DicebearProps} style 'profile' | 'event' | 'badge'
 * @param {DicebearProps} output 'svg' | 'uri'
 * @returns {string} SVG in XML format or URI
 */
export function generateDicebearAvatar({ seed, style, output }: DicebearProps): string {
  const avatar = createAvatar(styleMap[style], {
    seed,
  });

  return output === 'svg' ? avatar.toString() : avatar.toDataUri();
}
