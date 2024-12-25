'use client';

import { useState, useRef, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { z } from 'zod';
import { createProfileFormSchema } from '@/lib/formSchemas';
import { generateDicebearAvatar } from '@/lib/utils';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@/components/ui';
import { toast } from '@/hooks/use-toast';
import { useWallet } from '@solana/wallet-adapter-react';

export default function Page() {
  const { publicKey } = useWallet();
  const [profileImage, setProfileImage] = useState<string>('');
  const [isCustomImage, setIsCustomImage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof createProfileFormSchema>>({
    resolver: zodResolver(createProfileFormSchema),
    defaultValues: {
      name: '',
      profileImage: undefined,
    },
  });

  useEffect(() => {
    if (publicKey) {
      const svg = generateDicebearAvatar({
        seed: publicKey.toBase58(),
        style: 'profile',
        output: 'svg'
      });

      form.setValue('profileImage', svg);
      setProfileImage(svg);
      setIsLoading(false);
    }
  }, [publicKey, form]);


  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  async function onSubmit(values: z.infer<typeof createProfileFormSchema>) {
    try {
      setIsSubmitting(true);
      console.log('Form submission data:', values);

      // TODO: Add your API call here

      toast({
        title: 'Success',
        description: 'Profile created successfully!',
      });
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: 'Error',
        description: 'Failed to create profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen justify-center">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="ml-[-6px] text-2xl font-bold">Create Profile</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      className="rounded-lg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profileImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choose Your Profile Photo</FormLabel>
                  <div>
                    <div
                      className="relative h-36 w-36 cursor-pointer overflow-hidden rounded-lg"
                      onClick={handleImageClick}
                    >
                      {isLoading ? (
                        <div className="h-full w-full bg-muted" />
                      ) : isCustomImage ? (
                        <Image
                          src={profileImage}
                          alt="Profile preview"
                          layout="fill"
                          objectFit="cover"
                        />
                      ) : (
                        <div
                          className="h-full w-full"
                          dangerouslySetInnerHTML={{ __html: profileImage }}
                        />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      ref={fileInputRef}
                    />
                    <input type="hidden" {...field} value={field.value || ''} />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full rounded-xl bg-black text-white hover:bg-black/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
