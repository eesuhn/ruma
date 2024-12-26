'use client';

import { useState, useRef, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createEventFormSchema } from '@/lib/formSchemas';
import {
  CalendarIcon,
  Users,
  Globe2,
  LucideDoorClosed,
  Pen,
} from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import {
  cn,
  generateDicebearAvatarUri,
  handleImageChange,
  handleImageClick,
} from '@/lib/utils';
import {
  Button,
  Calendar,
  Card,
  CardContent,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Textarea,
  Switch,
  Separator,
  SelectValue,
} from '@/components/ui';
import { toast } from '@/hooks/use-toast';
import { useAnchorProgram } from '@/hooks/useAnchorProgram';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Cluster, ComputeBudgetProgram, Transaction } from '@solana/web3.js';
import { getExplorerLink } from '@solana-developers/helpers';
import { uploadFile } from '@/actions';

export default function Page() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const { getCreateEventIx, getCreateBadgeIx } = useAnchorProgram();
  const [eventImageUri, setEventImageUri] = useState<string>('');
  const [badgeImageUri, setBadgeImageUri] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const eventImageInputRef = useRef<HTMLInputElement>(null);
  const badgeImageInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof createEventFormSchema>>({
    resolver: zodResolver(createEventFormSchema),
    defaultValues: {
      eventName: '',
      visibility: 'public',
      location: '',
      about: '',
      requireApproval: false,
      capacity: null,
      badgeName: '',
      badgeSymbol: '',
      startDate: null,
      endDate: null,
      eventImage: undefined,
      badgeImage: undefined,
    },
  });

  useEffect(() => {
    if (publicKey) {
      if (!form.getValues('eventImage')) {
        const eventUri = generateDicebearAvatarUri({
          seed: publicKey.toBase58(),
          style: 'event',
        });

        setEventImageUri(eventUri);
      }

      if (!form.getValues('badgeImage')) {
        const badgeUri = generateDicebearAvatarUri({
          seed: publicKey.toBase58(),
          style: 'badge',
        });

        setBadgeImageUri(badgeUri);
      }
    }
  }, [publicKey, form]);

  async function onSubmit(values: z.infer<typeof createEventFormSchema>) {
    try {
      setIsUploading(true);
      const [uploadedEventImageUri, uploadedBadgeImageUri] = await uploadFile([
        eventImageUri,
        badgeImageUri,
      ]);
      setIsUploading(false);
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();

      const {
        visibility,
        requireApproval,
        eventName,
        capacity,
        startDate,
        endDate,
        location,
        about,
        badgeName,
        badgeSymbol,
      } = values;

      const createEventIx = await getCreateEventIx(
        visibility === 'public',
        requireApproval,
        eventName,
        uploadedEventImageUri,
        capacity,
        startDate?.getTime() ?? null,
        endDate?.getTime() ?? null,
        location,
        about
      );

      const createBadgeIx = await getCreateBadgeIx(
        eventName,
        badgeName,
        badgeSymbol,
        uploadedBadgeImageUri,
        capacity
      );

      const tx = new Transaction().add(
        ComputeBudgetProgram.setComputeUnitLimit({
          units: 400000,
        }),
        createEventIx,
        createBadgeIx
      );

      tx.recentBlockhash = blockhash;
      tx.lastValidBlockHeight = lastValidBlockHeight;

      const signature = await sendTransaction(tx, connection);

      await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight,
      });

      toast({
        title: 'Event create successfully',
        description: getExplorerLink(
          'tx',
          signature,
          process.env.NEXT_PUBLIC_CLUSTER! as Cluster
        ),
      });
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: 'Error',
        description: 'Failed to create event. Please try again.',
        variant: 'destructive',
      });

      setIsUploading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-6">
      <h1 className="mb-6 text-3xl font-bold">Create Event</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-6">
                <div className="w-1/3">
                  <div
                    className="relative aspect-square w-full cursor-pointer overflow-hidden rounded-lg border-2 border-dashed border-gray-300 transition-colors hover:border-gray-400"
                    onClick={() => handleImageClick(eventImageInputRef)}
                  >
                    {eventImageUri ? (
                      <Image
                        src={eventImageUri}
                        alt="Event image preview"
                        layout="fill"
                        objectFit="cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-muted" />
                    )}
                  </div>
                  <FormField
                    control={form.control}
                    name="eventImage"
                    render={({ field }) => (
                      <>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleImageChange(
                              e,
                              form,
                              'eventImage',
                              setEventImageUri
                            )
                          }
                          className="hidden"
                          ref={eventImageInputRef}
                        />
                        <input
                          type="hidden"
                          {...field}
                          value={field.value || ''}
                        />
                      </>
                    )}
                  />
                </div>
                <div className="w-2/3 space-y-4">
                  <FormField
                    control={form.control}
                    name="eventName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="BuidlerHub: Blockchain 101"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex w-1/2 flex-col">
                          <FormLabel>Start Date & Time</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={'outline'}
                                  className={cn(
                                    'w-full pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, 'PPP HH:mm')
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value || undefined}
                                onSelect={field.onChange}
                                initialFocus
                              />
                              <div className="border-t p-3">
                                <Input
                                  type="time"
                                  onChange={(e) => {
                                    const date = field.value
                                      ? new Date(field.value)
                                      : new Date();
                                    const [hours, minutes] =
                                      e.target.value.split(':');
                                    date.setHours(
                                      parseInt(hours),
                                      parseInt(minutes)
                                    );
                                    field.onChange(date);
                                  }}
                                />
                              </div>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex w-1/2 flex-col">
                          <FormLabel>End Date & Time</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={'outline'}
                                  className={cn(
                                    'w-full pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, 'PPP HH:mm')
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value || undefined}
                                onSelect={field.onChange}
                                initialFocus
                              />
                              <div className="border-t p-3">
                                <Input
                                  type="time"
                                  onChange={(e) => {
                                    const date = field.value
                                      ? new Date(field.value)
                                      : new Date();
                                    const [hours, minutes] =
                                      e.target.value.split(':');
                                    date.setHours(
                                      parseInt(hours),
                                      parseInt(minutes)
                                    );
                                    field.onChange(date);
                                  }}
                                />
                              </div>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="visibility"
                      render={({ field }) => (
                        <FormItem className="w-1/2">
                          <FormLabel>Visibility</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select visibility" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="public">
                                <div className="flex items-center">
                                  <Globe2 className="mr-2 h-4 w-4" />
                                  Public
                                </div>
                              </SelectItem>
                              <SelectItem value="private">
                                <div className="flex items-center">
                                  <LucideDoorClosed className="mr-2 h-4 w-4" />
                                  Private
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem className="w-1/2">
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="Kuala Lumpur" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name="about"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>About</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about your event"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 p-6">
              <FormField
                control={form.control}
                name="requireApproval"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Require Approval
                      </FormLabel>
                      <FormDescription>
                        Manually approve participants for this event
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Separator />

              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <FormLabel className="text-base">Capacity</FormLabel>
                      </div>
                      <FormDescription>
                        Set the maximum number of participants
                      </FormDescription>
                    </div>
                    <FormControl>
                      <div className="relative flex items-center gap-2">
                        <Input
                          type="text"
                          placeholder="Unlimited"
                          className="w-40 pl-8 text-right"
                          value={field.value === null ? '' : field.value}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === '') {
                              field.onChange(null);
                            } else {
                              const num = parseInt(value, 10);
                              if (!isNaN(num)) {
                                field.onChange(num);
                              }
                            }
                          }}
                        />
                        <Pen className="absolute left-2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Badge Details</h2>

              <div className="flex gap-6">
                <div className="w-1/4">
                  <div
                    className="relative aspect-square w-full cursor-pointer overflow-hidden rounded-lg border-2 border-dashed border-gray-300 transition-colors hover:border-gray-400"
                    onClick={() => handleImageClick(badgeImageInputRef)}
                  >
                    {badgeImageUri ? (
                      <Image
                        src={badgeImageUri}
                        alt="Badge image preview"
                        layout="fill"
                        objectFit="cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-muted" />
                    )}
                  </div>
                  <FormField
                    control={form.control}
                    name="badgeImage"
                    render={({ field }) => (
                      <>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleImageChange(
                              e,
                              form,
                              'badgeImage',
                              setBadgeImageUri
                            )
                          }
                          className="hidden"
                          ref={badgeImageInputRef}
                        />
                        <input
                          type="hidden"
                          {...field}
                          value={field.value || ''}
                        />
                      </>
                    )}
                  />
                </div>
                <div className="w-3/4 space-y-4">
                  <FormField
                    control={form.control}
                    name="badgeName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Chill Guy" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="badgeSymbol"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Symbol</FormLabel>
                        <FormControl>
                          <Input placeholder="CHG" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {isUploading
              ? 'Uploading files...'
              : form.formState.isSubmitting
                ? 'Waiting for signature...'
                : 'Create'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
