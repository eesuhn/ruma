'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarPlus, Edit, User } from 'lucide-react';

export default function ProfilePage() {
  const [name, setName] = useState('Tech XYZ');
  const [username, setUsername] = useState('@techxyz');

  const handleSaveChanges = () => {
    // Here you would typically update the profile information
    // For now, we'll just close the dialog
    console.log('Profile updated:', { name, username });
  };

  return (
    <div className="container mx-auto max-w-3xl p-4">
      <div className="mb-8 flex flex-col items-center">
        <div className="relative mb-4 h-24 w-24">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
            <User className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>
        <h1 className="mb-1 text-2xl font-bold">{name}</h1>
        <p className="mb-4 text-muted-foreground">Joined September 2022</p>
        <div className="mb-6 flex gap-8">
          <div className="text-center">
            <div className="font-bold">10</div>
            <div className="text-muted-foreground">Hosted</div>
          </div>
          <div className="text-center">
            <div className="font-bold">4</div>
            <div className="text-muted-foreground">Attended</div>
          </div>
        </div>
        <div className="flex gap-4">
          <Button
            asChild
            className="bg-blue-600 text-white transition ease-in-out hover:scale-105 hover:bg-blue-600"
          >
            <Link href="/events/create">
              <CalendarPlus className="mr-2 h-4 w-4" />
              Create Event
            </Link>
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-white text-black transition ease-in-out hover:scale-105 hover:bg-white">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Username
                  </Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleSaveChanges}>
                  Save changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="hosting" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="hosting">Hosting</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>
        <TabsContent value="hosting">
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Card key={i}>
                <CardContent className="flex gap-4 p-4">
                  <div className="h-20 w-20 flex-shrink-0 bg-muted" />
                  <div className="flex-grow">
                    <h3 className="font-semibold">Tech Conference 2023</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>By {name}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Mon, Oct 28, 5:00 PM - XYZ Tower
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="past">
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Card key={i}>
                <CardContent className="flex gap-4 p-4">
                  <div className="h-20 w-20 flex-shrink-0 bg-muted" />
                  <div className="flex-grow">
                    <h3 className="font-semibold">Tech Conference 2024</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>By {name}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Mon, Oct 28, 5:00 PM - XYZ Tower
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
