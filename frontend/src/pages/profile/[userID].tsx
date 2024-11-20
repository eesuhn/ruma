'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarPlus, Edit, User } from "lucide-react"

export default function ProfilePage() {
  const [name, setName] = useState('Tech XYZ')
  const [username, setUsername] = useState('@techxyz')

  const handleSaveChanges = () => {
    // Here you would typically update the profile information
    // For now, we'll just close the dialog
    console.log('Profile updated:', { name, username })
  }

  return (
    <div className="container max-w-3xl mx-auto p-4">
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-24 h-24 mb-4">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
            <User className="w-12 h-12 text-muted-foreground" />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-1">{name}</h1>
        <p className="text-muted-foreground mb-4">Joined September 2022</p>
        <div className="flex gap-8 mb-6">
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
          <Button asChild className="bg-blue-600 hover:bg-blue-600 text-white hover:scale-105 transition ease-in-out">
            <Link href="/events/create">
              <CalendarPlus className="mr-2 h-4 w-4" />
              Create Event
            </Link>
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="text-black bg-white hover:bg-white hover:scale-105 transition ease-in-out">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're done.
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
                <Button type="submit" onClick={handleSaveChanges}>Save changes</Button>
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
                  <div className="w-20 h-20 bg-muted flex-shrink-0" />
                  <div className="flex-grow">
                    <h3 className="font-semibold">Tech Conference 2023</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span>By {name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
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
                  <div className="w-20 h-20 bg-muted flex-shrink-0" />
                  <div className="flex-grow">
                    <h3 className="font-semibold">Tech Conference 2024</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span>By {name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
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
  )
}