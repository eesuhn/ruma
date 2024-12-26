'use client';

import { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
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
  Form,
  FormControl,
  FormField,
  FormItem,
} from '@/components/ui';
import Image from 'next/image';
import { UserData } from '@/types/state';
import { statusStyles, formatStatus } from '@/lib/utils';
import { Status } from '@/types/event';
import QRScanner from '@/components/QRScanner';

const statusFormSchema = z.object({
  status: z.enum(['going', 'pending', 'rejected', 'checked-in'] as const),
});

type StatusFormValues = z.infer<typeof statusFormSchema>;

interface ParticipantInfo extends UserData {
  publicKey: string;
  status: Status;
}

const participants: ParticipantInfo[] = [
  {
    publicKey: '4b2j...w6oZ',
    name: 'Jeff Bezos',
    image: '/sample/profile.png',
    status: 'going',
  },
  {
    publicKey: 'K9Tx...2x9a',
    name: 'Mary Lane',
    image: '/sample/profile.png',
    status: 'pending',
  },
  {
    publicKey: 'J7gC...x41k',
    name: 'David Jackson',
    image: '/sample/profile.png',
    status: 'rejected',
  },
  {
    publicKey: 'mBm...6q1e',
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<StatusFormValues>({
    resolver: zodResolver(statusFormSchema),
    defaultValues: {
      status: undefined,
    },
  });

  const filteredParticipants = participants.filter((participant) => {
    const matchesSearch = participant.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || participant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (values: StatusFormValues) => {
    if (selectedParticipant) {
      console.log(
        `Updating ${selectedParticipant.name}'s status to ${values.status}`
      );
      form.reset();
      setSelectedParticipant(null);
      setIsDialogOpen(false);
    }
  };

  const handleQRScan = useCallback((data: string) => {
    // TODO: Handle QR code scan
    window.alert('Verified');
    window.location.reload();
  }, []);

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
            {(['going', 'pending', 'rejected', 'checked-in'] as Status[]).map(
              (status) => (
                <SelectItem key={status} value={status}>
                  {formatStatus(status)}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
        <QRScanner onScan={handleQRScan} />
      </div>

      <div className="divide-y rounded-lg border">
        {filteredParticipants.map((participant) => (
          <Dialog
            key={participant.publicKey}
            open={
              isDialogOpen &&
              selectedParticipant?.publicKey === participant.publicKey
            }
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                setSelectedParticipant(null);
                form.reset();
              }
            }}
          >
            <DialogTrigger asChild>
              <button
                className="flex w-full items-center justify-between p-4 hover:bg-gray-50"
                onClick={() => {
                  setSelectedParticipant(participant);
                  form.setValue('status', participant.status);
                  setIsDialogOpen(true);
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
                  {selectedParticipant && (
                    <Image
                      src={selectedParticipant.image}
                      alt={selectedParticipant.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  )}
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
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleStatusChange)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="status"
                    defaultValue={selectedParticipant?.status}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose new status" />
                            </SelectTrigger>
                            <SelectContent>
                              {(
                                [
                                  'going',
                                  'pending',
                                  'rejected',
                                  'checked-in',
                                ] as const
                              ).map((status) => (
                                <SelectItem key={status} value={status}>
                                  {formatStatus(status)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end">
                    <Button type="submit" className="bg-black text-white">
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}
