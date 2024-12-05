'use client';

import { useState } from 'react';
import { Camera, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

type Status = 'going' | 'pending' | 'rejected' | 'checked-in';

interface Participant {
  id: string;
  name: string;
  image: string;
  status: Status;
}

const participants: Participant[] = [
  {
    id: '4b2j...w6oZ',
    name: 'Jeff Bezos',
    image: '/sample/profile.png',
    status: 'going',
  },
  {
    id: 'K9Tx...2x9a',
    name: 'Mary Lane',
    image: '/sample/profile.png',
    status: 'pending',
  },
  {
    id: 'J7gC...x41k',
    name: 'David Jackson',
    image: '/sample/profile.png',
    status: 'rejected',
  },
  {
    id: 'mBm...6q1e',
    name: 'Amy Lau',
    image: '/sample/profile.png',
    status: 'checked-in',
  },
];

const statusStyles = {
  going: 'bg-green-100 text-green-800 hover:bg-green-200',
  pending: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
  rejected: 'bg-red-100 text-red-800 hover:bg-red-200',
  'checked-in': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
};

export default function Page() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedParticipant, setSelectedParticipant] =
    useState<Participant | null>(null);
  const [editStatus, setEditStatus] = useState<Status | ''>('');

  const filteredParticipants = participants.filter((participant) => {
    const matchesSearch = participant.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || participant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (status: Status) => {
    if (selectedParticipant) {
      // In a real app, you would update this in your backend
      console.log(`Updating ${selectedParticipant.name}'s status to ${status}`);
      setEditStatus('');
      setSelectedParticipant(null); // This will close the dialog
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-8 text-3xl font-bold">Event Name</h1>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Guests" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Guests</SelectItem>
            <SelectItem value="going">Going</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="checked-in">Checked In</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="default" className="bg-black">
          <Camera className="mr-2 h-4 w-4" /> Scan Ticket
        </Button>
      </div>

      <div className="divide-y rounded-lg border">
        {filteredParticipants.map((participant) => (
          <Dialog key={participant.id}>
            <DialogTrigger asChild>
              <button
                className="flex w-full items-center justify-between p-4 hover:bg-gray-50"
                onClick={() => {
                  setSelectedParticipant(participant);
                  setEditStatus(participant.status);
                }}
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={participant.image}
                    alt={participant.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div className="text-left">
                    <div className="font-medium">{participant.name}</div>
                    <div className="text-sm text-gray-500">
                      {participant.id}
                    </div>
                  </div>
                </div>
                <Badge className={statusStyles[participant.status]}>
                  {participant.status.charAt(0).toUpperCase() +
                    participant.status.slice(1)}
                </Badge>
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <Image
                    src={selectedParticipant?.image || ''}
                    alt={selectedParticipant?.name || ''}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <DialogTitle className="text-left">
                      {selectedParticipant?.name}
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground">
                      {selectedParticipant?.id}
                    </p>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-4">
                <Select
                  value={editStatus}
                  onValueChange={(value) => setEditStatus(value as Status)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose new status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="going">Going</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="checked-in">Checked-In</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex justify-end">
                  <Button
                    onClick={() => handleStatusChange(editStatus as Status)}
                    className="bg-black text-white"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}
