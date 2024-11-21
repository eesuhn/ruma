'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Globe, Image as ImageIcon, X } from 'lucide-react';
import { useState, ChangeEvent, useRef } from 'react';

export default function Component() {
  const [requireApproval, setRequireApproval] = useState(false);
  const [isUnlimited, setIsUnlimited] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="container max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-6">Create a new event</h1>
      <form className="space-y-6 sm:space-y-8">
        <div className="space-y-2">
          <Label htmlFor="event-image">Event Banner</Label>
          <Card className="aspect-video w-full bg-muted flex items-center justify-center overflow-hidden relative">
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Event banner preview"
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveImage}
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <div className="flex flex-col items-center text-muted-foreground">
                <ImageIcon className="h-12 w-12 sm:h-16 sm:w-16 mb-2" />
                <span className="text-sm sm:text-base">No image uploaded</span>
              </div>
            )}
          </Card>
          <Input
            id="event-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-2"
            ref={fileInputRef}
          />
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="event-name">Event Name</Label>
            <Input
              id="event-name"
              placeholder="Enter event name"
              className="mt-1.5"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:space-y-4">
              <Label>Start</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="date"
                  defaultValue="2024-10-19"
                  className="bg-muted"
                />
                <Input type="time" defaultValue="18:00" className="bg-muted" />
              </div>
            </div>
            <div className="space-y-2 sm:space-y-4">
              <Label>End</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="date"
                  defaultValue="2024-10-19"
                  className="bg-muted"
                />
                <Input type="time" defaultValue="20:00" className="bg-muted" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md w-fit">
            <Globe className="h-4 w-4" />
            <span className="text-xs sm:text-sm">GMT +08:00</span>
            <span className="text-xs sm:text-sm text-muted-foreground">
              Singapore
            </span>
          </div>

          <div>
            <Label htmlFor="location">Add Event Location</Label>
            <Input
              id="location"
              placeholder="Physical location or virtual link"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="description">Add Description</Label>
            <Textarea
              id="description"
              placeholder="Write about your event..."
              className="mt-1.5"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Event Options</h2>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="approval">Require Approval</Label>
              </div>
              <Switch
                id="approval"
                checked={requireApproval}
                onCheckedChange={setRequireApproval}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="capacity">Capacity</Label>
              </div>
              <div className="flex items-center gap-2">
                {!isUnlimited && (
                  <Input
                    type="number"
                    placeholder="Enter capacity"
                    className="w-20 sm:w-24"
                  />
                )}
                <Switch
                  id="capacity"
                  checked={isUnlimited}
                  onCheckedChange={setIsUnlimited}
                />
                <span className="text-xs sm:text-sm text-muted-foreground">
                  Unlimited
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button type="submit" size="lg" className="w-full max-w-md">
            Create Event
          </Button>
        </div>
      </form>
    </div>
  );
}
