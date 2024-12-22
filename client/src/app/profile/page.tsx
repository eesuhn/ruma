import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, Trophy, Users } from 'lucide-react';
import Image from 'next/image';

interface Badge {
  id: string;
  name: string;
  image: string;
  earnedDate: string;
}

interface Profile {
  name: string;
  hosted: number;
  attended: number;
  image: string;
}
const profile: Profile = {
  name: 'Woods',
  hosted: 10,
  attended: 4,
  image: '/sample/profile.png',
};

// Example badges data
const badges: Badge[] = [
  {
    id: '1',
    name: 'Early Adopter',
    image: '/sample/nft.svg',
    earnedDate: '2023-01-15',
  },
  {
    id: '2',
    name: 'Top Contributor',
    image: '/sample/nft.svg',
    earnedDate: '2023-03-20',
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20">
                <Image
                  src={profile.image}
                  alt="Profile"
                  className="rounded-full"
                  width={80}
                  height={80}
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{profile.name}</h1>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit profile</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                      </DialogHeader>
                      <div className="">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input id="name" defaultValue="Tech XYZ" />
                        </div>
                        <div className="flex justify-end gap-4 pt-4">
                          <Button variant="ghost" className="h-9">
                            Cancel
                          </Button>
                          <Button className="h-9">Save</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="mt-2 flex gap-6">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>{profile.hosted}</strong> Hosted
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>{profile.attended}</strong> Attended
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="">
        {badges.length > 0 ? (
          <div>
            <h2 className="mb-4 text-xl font-semibold">Badges Collection</h2>
            <div className="grid grid-cols-6">
              {badges.map((badge) => (
                <Image
                  key={badge.id}
                  src={badge.image}
                  alt={badge.name}
                  width={80}
                  height={80}
                  className="rounded-xl"
                />
              ))}
            </div>
          </div>
        ) : (
          <h2 className="mt-12 text-center text-xl font-bold">
            No badges Collected
          </h2>
        )}
      </div>
    </div>
  );
}