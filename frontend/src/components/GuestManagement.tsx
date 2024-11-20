'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { AtAGlance } from "./AtAGlance"

type Guest = {
  id: number
  name: string
  status: 'Pending' | 'Approved' | 'Checked In'
}

export function GuestManagement() {
  const [guests, setGuests] = useState<Guest[]>([
    { id: 1, name: "Alice Johnson", status: "Checked In" },
    { id: 2, name: "Bob Smith", status: "Pending" },
    { id: 3, name: "Charlie Brown", status: "Approved" },
    { id: 4, name: "David Lee", status: "Pending" },
    { id: 5, name: "Eva Martinez", status: "Checked In" },
  ])

  const approveGuest = (id: number) => {
    setGuests(guests.map(guest => 
      guest.id === id ? { ...guest, status: "Approved" } : guest
    ))
  }

  const checkedInGuests = guests.filter(guest => guest.status === "Checked In")
  const approvedGuests = guests.filter(guest => guest.status === "Approved")
  const pendingGuests = guests.filter(guest => guest.status === "Pending")

  return (
    <div className="space-y-8">
      <AtAGlance />
      
      <Card>
        <CardHeader>
          <CardTitle>Participant List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[600px]">Name</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...checkedInGuests, ...approvedGuests].map((guest) => (
                <TableRow key={guest.id}>
                  <TableCell>{guest.name}</TableCell>
                  <TableCell>{guest.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Approval List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[600px]">Name</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingGuests.map((guest) => (
                <TableRow key={guest.id}>
                  <TableCell>{guest.name}</TableCell>
                  <TableCell>
                    <Button onClick={() => approveGuest(guest.id)}>Approve</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
