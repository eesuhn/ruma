import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit, Trophy, Users } from 'lucide-react'
import Image from "next/image"

interface Badge {
  id: string
  name: string
  image: string
  earnedDate: string
}

interface Profile {
  name:string
  hosted:number
  attended:number
  image:string
}
const profile:Profile = {
  name: "Woods",
  hosted: 10,
  attended: 4,
  image: "/profile1.png"
}

// Example badges data
const badges: Badge[] = [
  {
    id: "1",
    name: "Early Adopter",
    image: "/badge1.png",
    earnedDate: "2023-01-15"
  },
  {
    id: "2",
    name: "Top Contributor",
    image: "/badge1.png",
    earnedDate: "2023-03-20"
  },
]

export default function ProfilePage() {
  return (
    <div className="max-w-2xl  mx-auto p-6 space-y-8">
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
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input id="name" defaultValue="Tech XYZ" />
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="flex gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm"><strong>{profile.hosted}</strong> Hosted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm"><strong>{profile.attended}</strong> Attended</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </CardContent>
      </Card>

      <div className="space-y-4">
        {badges.length > 0 ? (
          <div>
          <h2 className="text-xl font-semibold">Badges Collection</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-2">
            {badges.map((badge) => (
              <Card key={badge.id}>
                <CardContent className="p-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Image
                      src={badge.image}
                      alt={badge.name}
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                    <h3 className="font-medium">{badge.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      Earned {new Date(badge.earnedDate).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          </div>
        ):(<h2 className="text-center font-bold text-xl mt-12">No badges Collected</h2>)}
        
      </div>
    </div>
  )
}

