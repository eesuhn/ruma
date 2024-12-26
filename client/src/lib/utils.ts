import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { createAvatar } from '@dicebear/core';
import { bigSmile, shapes, rings } from '@dicebear/collection';
import { UseFormReturn } from 'react-hook-form';
import { RefObject } from 'react';

interface DicebearProps {
  seed: string;
  style: 'profile' | 'event' | 'badge';
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
 * Generate a Dicebear Avatar URI based on the seed and style
 *
 * @param {DicebearProps} seed
 * @param {DicebearProps} style 'profile' | 'event' | 'badge'
 * @returns {string} Avatar URI
 */
export function generateDicebearAvatarUri({
  seed,
  style,
}: DicebearProps): string {
  return createAvatar(styleMap[style], {
    seed,
  }).toDataUri();
}

export function handleImageChange(
  event: React.ChangeEvent<HTMLInputElement>,
  form: UseFormReturn<any, any, undefined>,
  formFieldName: string,
  setProfileImageUri: (image: string) => void
) {
  const file = event.target.files?.[0];

  if (file) {
    form.setValue(formFieldName, file);

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setProfileImageUri(reader.result as string);
    };
  }
}

export function handleImageClick(ref: RefObject<HTMLInputElement>) {
  ref.current?.click();
}

export const statusStyles = {
  going: 'bg-green-100 text-green-800 hover:bg-green-200',
  pending: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
  rejected: 'bg-red-100 text-red-800 hover:bg-red-200',
  'checked-in': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
};

export const formatStatus = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};
