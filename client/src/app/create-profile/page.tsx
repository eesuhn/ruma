'use client';

import { useState, useRef, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { z } from 'zod';
import { createProfileFormSchema } from '@/lib/formSchemas';
import {
  handleImageChange,
  handleImageClick,
  setComputeUnitLimitAndPrice,
} from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useAnchorProgram } from '@/hooks/useAnchorProgram';
import { getExplorerLink } from '@solana-developers/helpers';
import { Cluster } from '@solana/web3.js';
import { upload } from '@/actions/irys';
import { fetchDicebearAsFile, getRandomDicebearLink } from '@/lib/dicebear';

export default function Page() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const { getCreateProfileIx } = useAnchorProgram();
  const [profileImageSrc, setProfileImageSrc] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
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
      setProfileImageSrc(
        getRandomDicebearLink('profile', publicKey.toBase58())
      );
    }
  }, [publicKey]);

  async function onSubmit(values: z.infer<typeof createProfileFormSchema>) {
    try {
      setIsUploading(true);
      const uploadedImageUri = await upload(
        values.profileImage ??
          fetchDicebearAsFile('profile', publicKey!.toBase58())
      );
      setIsUploading(false);

      const ix = await getCreateProfileIx(values.name, uploadedImageUri);
      const tx = await setComputeUnitLimitAndPrice(
        connection,
        [ix],
        publicKey!
      );

      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      tx.lastValidBlockHeight = lastValidBlockHeight;

      const signature = await sendTransaction(tx, connection);

      await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight,
      });

      toast({
        title: 'Profile created successfully',
        description: getExplorerLink(
          'tx',
          signature,
          process.env.NEXT_PUBLIC_RPC_CLUSTER! as Cluster
        ),
      });
    } catch (error) {
      console.error(error);

      toast({
        title: 'Error',
        description: 'Failed to create profile. Please try again.',
        variant: 'destructive',
      });

      setIsUploading(false);
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
                      onClick={() => handleImageClick(fileInputRef)}
                    >
                      {profileImageSrc ? (
                        <Image
                          src={profileImageSrc}
                          alt="Profile preview"
                          layout="fill"
                          objectFit="cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-muted" />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImageChange(
                          e,
                          form,
                          'profileImage',
                          setProfileImageSrc
                        )
                      }
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
    </div>
  );
}
