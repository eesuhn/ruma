'use client';

import { useState } from 'react';
import { Camera, Search } from 'lucide-react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
} from '@/components/ui';
import Image from 'next/image';
import { UserData } from '@/types/state';
import { statusStyles, formatStatus } from '@/lib/utils';

type Status = 'going' | 'pending' | 'rejected' | 'checked-in';

interface ParticipantInfo extends UserData {
  publicKey: string;
  status: Status;
}

const participants: ParticipantInfo[] = [
  {
    publicKey: '4b2j...w6oZ',
    bump: 1,
    name: 'Jeff Bezos',
    image: '/sample/profile.png',
    status: 'going',
  },
  {
    publicKey: 'K9Tx...2x9a',
    bump: 1,
    name: 'Mary Lane',
    image: '/sample/profile.png',
    status: 'pending',
  },
  {
    publicKey: 'J7gC...x41k',
    bump: 1,
    name: 'David Jackson',
    image: '/sample/profile.png',
    status: 'rejected',
  },
  {
    publicKey: 'mBm...6q1e',
    bump: 1,
    name: 'Amy Lau',
    image: '/sample/profile.png',
    status: 'checked-in',
  },
];

export default function Page() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedParticipant, setSelectedParticipant] =
    useState<ParticipantInfo | null>(null);
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
      // TODO: Update participant status
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
          <Dialog key={participant.publicKey}>
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
                      {participant.publicKey}
                    </div>
                  </div>
                </div>
                <Badge className={statusStyles[participant.status]}>
                  {formatStatus(participant.status)}
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
                      {selectedParticipant?.publicKey}
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
