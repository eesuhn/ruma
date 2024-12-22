'use client';

import { useState, useRef, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  CalendarIcon,
  Users,
  Globe2,
  LucideDoorClosed,
  Pen,
} from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { generateDicebear } from '@/hooks/useDicebear';

const formSchema = z.object({
  eventName: z.string().min(2, {
    message: 'Event name must be at least 2 characters.',
  }),
  visibility: z.string(),
  dateRange: z.object({
    from: z.date(),
    to: z.date().optional(),
  }),
  location: z.string().min(1, {
    message: 'Location is required.',
  }),
  about: z.string(),
  requireApproval: z.boolean().default(false),
  capacity: z.string().default('unlimited'),
  badgeName: z.string().min(2, {
    message: 'Badge name must be at least 2 characters.',
  }),
  badgeSymbol: z.string().min(1, {
    message: 'Badge symbol is required.',
  }),
});

export default function Page() {
  const [eventImage, setEventImage] = useState<string | null>(null);
  const [badgeImage, setBadgeImage] = useState<string | null>(null);
  const [isCustomEventImage, setIsCustomEventImage] = useState(false);
  const [isCustomBadgeImage, setIsCustomBadgeImage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [eventSeed, setBadgeSeed] = useState('');
  const [badgeSeed, setEventSeed] = useState('');
  const eventImageInputRef = useRef<HTMLInputElement>(null);
  const badgeImageInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      visibility: 'public',
      requireApproval: false,
      capacity: '',
      dateRange: {
        from: new Date(),
        to: undefined,
      },
    },
  });

  useEffect(() => {
    setBadgeSeed(Math.random().toString(36).substring(7));
    setEventSeed(Math.random().toString(36).substring(7));
  }, []);

  useEffect(() => {
    if (eventSeed && badgeSeed) {
      // TODO: Save generated SVG to IPFS
      const eventSvg = generateDicebear({ seed: eventSeed, style: 'event' });
      const badgeSvg = generateDicebear({ seed: badgeSeed, style: 'badge' });
      setEventImage(eventSvg);
      setBadgeImage(badgeSvg);
      setIsLoading(false);
    }
  }, [eventSeed, badgeSeed]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log({ ...values, eventImage, badgeImage });
  }

  const handleImageChange =
    (
      setter: React.Dispatch<React.SetStateAction<string | null>>,
      setCustom: React.Dispatch<React.SetStateAction<boolean>>
    ) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setter(reader.result as string);
          setCustom(true);
        };
        reader.readAsDataURL(file);
      }
    };

  const handleImageClick = (ref: React.RefObject<HTMLInputElement>) => () => {
    ref.current?.click();
  };

  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-6">
      <h1 className="mb-4 text-2xl font-bold">Create Event</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="mb-[-8px] flex gap-6">
            <div className="w-1/3">
              <div
                className="relative aspect-square w-64 cursor-pointer overflow-hidden rounded-lg"
                onClick={handleImageClick(eventImageInputRef)}
              >
                {isLoading ? (
                  <div className="flex h-full w-full items-center justify-center bg-muted" />
                ) : isCustomEventImage ? (
                  <Image
                    src={eventImage!}
                    alt="Event image preview"
                    layout="fill"
                    objectFit="cover"
                  />
                ) : (
                  <div
                    className="h-full w-full"
                    dangerouslySetInnerHTML={{ __html: eventImage || '' }}
                  />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange(
                  setEventImage,
                  setIsCustomEventImage
                )}
                className="hidden"
                ref={eventImageInputRef}
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

              <div className="flex gap-6">
                <div className="mt-2 w-1/2">
                  <FormField
                    control={form.control}
                    name="dateRange"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="mb-1">Event Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'w-full justify-start text-left font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value?.from ? (
                                  field.value.to ? (
                                    <>
                                      {format(field.value.from, 'LLL dd, y')} -{' '}
                                      {format(field.value.to, 'LLL dd, y')}
                                    </>
                                  ) : (
                                    format(field.value.from, 'LLL dd, y')
                                  )
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              initialFocus
                              mode="range"
                              defaultMonth={field.value?.from}
                              selected={field.value}
                              onSelect={field.onChange}
                              numberOfMonths={2}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mt-[2px] w-1/2">
                  <FormField
                    control={form.control}
                    name="visibility"
                    render={({ field }) => (
                      <FormItem>
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
                </div>
              </div>

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
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

          <div className="space-y-4">
            <div className="space-y-4 rounded-lg border p-4">
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

              <div className="w-full border-t border-muted" />

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
                          {...field}
                        />
                        <Pen className="absolute left-2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Badge Details</h2>

            <div className="flex gap-6">
              <div className="w-1/4">
                <div
                  className="relative aspect-square w-48 cursor-pointer overflow-hidden rounded-lg"
                  onClick={handleImageClick(badgeImageInputRef)}
                >
                  {isLoading ? (
                    <div className="flex h-full w-full items-center justify-center bg-muted" />
                  ) : isCustomBadgeImage ? (
                    <Image
                      src={badgeImage!}
                      alt="Badge image preview"
                      layout="fill"
                      objectFit="cover"
                    />
                  ) : (
                    <div
                      className="h-full w-full"
                      dangerouslySetInnerHTML={{ __html: badgeImage || '' }}
                    />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange(
                    setBadgeImage,
                    setIsCustomBadgeImage
                  )}
                  className="hidden"
                  ref={badgeImageInputRef}
                />
              </div>
              <div className="mt-[-6px] w-3/4 space-y-4">
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
          </div>

          <Button type="submit" className="w-full">
            Create Event
          </Button>
        </form>
      </Form>
    </div>
  );
}
