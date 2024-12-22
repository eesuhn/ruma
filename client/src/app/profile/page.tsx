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
import { Tooltip, TooltipContent, TooltipTrigger,TooltipProvider } from '@/components/ui/tooltip';

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

      <div className="cursor-default">
        {badges.length > 0 ? (
          <div>
            <h2 className="mb-4 text-xl font-semibold">Badges Collection</h2>
            <TooltipProvider>
              <div className="grid grid-cols-6 p-2 cursor-default items-center gap-8">
                {badges.map((badge) => (
                  <Tooltip key={badge.id}>
                    <TooltipTrigger asChild>
                      <div className="w-20 h-20 flex items-center justify-center ">
                        <Image
                          src={badge.image}
                          alt={badge.name}
                          width={80}
                          height={80}
                          className="rounded-xl cursor-default object-cover w-full h-full"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{badge.name}</p>
                      <p>Earned on: {badge.earnedDate}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
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
