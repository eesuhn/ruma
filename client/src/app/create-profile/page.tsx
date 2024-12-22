'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { generateDicebear } from '@/hooks/useDicebear';

export default function Page() {
  const [seed, setSeed] = useState<string>('');
  const [profileImage, setProfileImage] = useState<string>('');
  const [isCustomImage, setIsCustomImage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // TODO: Replace the seed with user wallet address
    setSeed(Math.random().toString(36).substring(7));
  }, []);

  useEffect(() => {
    if (seed) {
      // TODO: Save generated SVG to IPFS
      const svg = generateDicebear({ seed, style: 'profile' });
      setProfileImage(svg);
      setIsLoading(false);
    }
  }, [seed]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        setIsCustomImage(true);
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
              {isLoading ? (
                <div className="h-full w-full bg-muted" />
              ) : isCustomImage ? (
                <Image
                  src={profileImage}
                  alt="Profile preview"
                  layout="fill"
                  objectFit="cover"
                />
              ) : (
                <div
                  className="h-full w-full"
                  dangerouslySetInnerHTML={{ __html: profileImage }}
                />
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
