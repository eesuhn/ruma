'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CameraIcon } from 'lucide-react';

export default function CreateProfile() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex min-h-screen justify-center">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="ml-[-6px] text-2xl font-bold">Create Profile</h1>
        <div className="space-y-2">
          <label className="text-sm">Name</label>
          <Input placeholder="John Doe" className="rounded-lg" />
        </div>
        <div className="space-y-2">
          <label className="text-sm">Choose Your Profile Photo</label>
          <div>
            <div
              className="relative h-36 w-36 cursor-pointer overflow-hidden rounded-lg"
              onClick={handleImageClick}
            >
              {profileImage ? (
                <Image
                  src={profileImage}
                  alt="Profile preview"
                  layout="fill"
                  objectFit="cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                  <CameraIcon size={48} />
                </div>
              )}
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            ref={fileInputRef}
          />
        </div>
        <Button className="w-full rounded-xl bg-black text-white hover:bg-black/90">
          Create
        </Button>
      </div>
    </div>
  );
}
