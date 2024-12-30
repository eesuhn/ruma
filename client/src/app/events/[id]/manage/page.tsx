'use client';

import { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
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
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import Image from 'next/image';
import { capitalizeFirstLetter } from '@/lib/utils';
import { RegistrationStatus } from '@/types/event';
import { QRScanner } from '@/components/QRScanner';
import { statusFormSchema } from '@/lib/formSchemas';
import useSWR from 'swr';
import { useAnchorProgram } from '@/hooks/useAnchorProgram';
import { useParams } from 'next/navigation';
import { PublicKey } from '@solana/web3.js';

const allowedRegistrationStatues = [
  'approved',
  'pending',
  'checked-in',
  'rejected',
]

export default function Page() {
  const params = useParams<{ id: string }>();
  const { getEventAcc, getMultipleUserAcc, getMultipleAttendeeAcc } = useAnchorProgram();
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAttendee, setSelectedAttendee] = useState<any>(null);
  const { data, isLoading, error } = useSWR([params.id, search], async () => {
    const event = await getEventAcc(new PublicKey(params.id));

    if (!event) {
      throw new Error('Event not found');
    }

    let attendees = [];

    const attendeeAccs = (await getMultipleAttendeeAcc(event.attendees)).filter((acc) => acc !== null);
    const userAccs = (await getMultipleUserAcc(attendeeAccs.map((acc) => acc.user))).filter((acc) => acc !== null)

    attendees = attendeeAccs
      .map((acc, i) => {
        return {
          pda: event.attendees[i].toBase58(),
          status: Object.keys(acc.status)[0],
          name: userAccs[i].data.name,
          image: userAccs[i].data.image
        }
      })
      .filter((attendee) => {
        return attendee.name.toLowerCase().includes(search.toLowerCase())
          && ['all', statusFilter].includes(attendee.status)
      })

    return {
      eventName: event.data.name,
      attendees,
    }
  })

  const form = useForm<z.infer<typeof statusFormSchema>>({
    resolver: zodResolver(statusFormSchema),
    defaultValues: {
      status: undefined,
    },
  });

  function handleStatusChange(values: z.infer<typeof statusFormSchema>) {
    if (selectedAttendee) {
      // TODO: implement changeAttendeeStatus
      form.reset();
      setSelectedAttendee(null);
    }
  };

  const handleQRScan = useCallback((data: string) => {
    // TODO: implement checkIntoEvent
    void data;
    window.alert('Verified');
    window.location.reload();
  }, []);

  // TODO: add error and loading states
  if (error) return <p>{error.message}</p>;
  if (isLoading) return <p>Loading...</p>;

  return data && (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-8 text-3xl font-bold">{data.eventName}</h1>

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
            {allowedRegistrationStatues.map((status) => (
              <SelectItem key={status} value={status}>
                {capitalizeFirstLetter(status)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <QRScanner onScan={handleQRScan} />
      </div>

      <div className="divide-y rounded-lg border">
        {data.attendees.map((attendee) => (
          <Dialog
            key={attendee.pda}
            onOpenChange={(open) => {
              if (!open) {
                setSelectedAttendee(null);
                form.reset();
              }
            }}
          >
            <DialogTrigger asChild>
              <button
                className="flex w-full items-center justify-between p-4 hover:bg-gray-50"
                onClick={() => {
                  setSelectedAttendee(attendee);
                  form.setValue('status', attendee.status as RegistrationStatus);
                }}
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={attendee.image}
                    alt={attendee.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div className="text-left">
                    <div className="font-medium">{attendee.name}</div>
                    <div className="text-sm text-gray-500">
                      {attendee.pda}
                    </div>
                  </div>
                </div>
                <Badge className={`bg-badge-${attendee.status}`}>
                  {capitalizeFirstLetter(attendee.status)}
                </Badge>
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  {selectedAttendee && (
                    <Image
                      src={selectedAttendee.image}
                      alt={selectedAttendee.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  )}
                  <div>
                    <DialogTitle className="text-left">
                      {selectedAttendee?.name}
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground">
                      {selectedAttendee?.publicKey}
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
                    defaultValue={selectedAttendee?.status}
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
                              {allowedRegistrationStatues.map((status) => (
                                <SelectItem key={status} value={status}>
                                  {capitalizeFirstLetter(status)}
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
