import { createAvatar } from '@dicebear/core';
import { bigSmile, shapes, rings } from '@dicebear/collection';

type AvatarStyle = 'profile' | 'event' | 'badge';

interface DicebearProps {
  seed: string;
  style: AvatarStyle;
}

/**
 * Generate a Dicebear SVG based on the seed and style
 *
 * @param {DicebearProps} seed
 * @param {DicebearProps} style 'profile' | 'event' | 'badge'
 * @returns {string} svg
 */
export function generateDicebear({ seed, style }: DicebearProps): string {
  const styleMap = {
    profile: bigSmile,
    event: shapes,
    badge: rings,
  };

  const svg = createAvatar(styleMap[style], {
    seed,
  }).toString();
  return svg;
}
