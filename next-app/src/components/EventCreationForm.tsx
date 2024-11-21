'use client';

import { useState } from 'react';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Globe } from 'lucide-react';

export function EventCreationForm() {
  const [isUnlimited, setIsUnlimited] = useState(true);

  return (
    <div className="flex flex-col gap-12 p-8 lg:flex-row">
      <div className="lg:w-1/2">
        <div className="relative mt-[8px] h-[400px] w-full overflow-hidden rounded-lg">
          <img
            src="/landingimg.jpg?height=400&width=600"
            alt="Event cover"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <Button
              variant="outline"
              className="border-white text-black transition-colors hover:scale-105 hover:bg-white"
            >
              <Camera className="mr-2 h-4 w-4" /> Choose event cover
            </Button>
          </div>
        </div>
      </div>
      <div className="bg-transparent lg:w-1/2">
        <Card className="border-none bg-transparent shadow-none">
          <CardContent className="space-y-6 px-0">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:space-y-4">
                <Label>Start</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    defaultValue="2024-10-19"
                    className="bg-muted"
                  />
                  <Input
                    type="time"
                    defaultValue="18:00"
                    className="bg-muted"
                  />
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
                  <Input
                    type="time"
                    defaultValue="20:00"
                    className="bg-muted"
                  />
                </div>
              </div>
            </div>
            <div className="flex w-fit items-center gap-2 rounded-md bg-muted/50 p-2">
              <Globe className="h-4 w-4" />
              <span className="text-xs sm:text-sm">GMT +08:00</span>
              <span className="text-xs text-muted-foreground sm:text-sm">
                Singapore
              </span>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="location" className="text-sm font-medium">
                Event Location
              </Label>
              <Input
                id="location"
                placeholder="Enter event location"
                className="border-gray-300"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-sm font-medium">
                Event Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your event"
                className="border-gray-300"
              />
            </div>
            <div className="space-y-1.5">
              <Select defaultValue="public">
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="invite-only">Invite-only</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
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
                <span className="text-xs text-muted-foreground sm:text-sm">
                  Unlimited
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="px-0">
            <Button className="w-full bg-black text-white hover:bg-gray-800">
              Create Event
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
