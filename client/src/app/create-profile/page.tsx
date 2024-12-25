'use client';

import { useState, useRef, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { z } from 'zod';
import { createProfileFormSchema } from '@/lib/formSchemas';
import {
  generateDicebearAvatarUri,
  handleImageChange,
  handleImageClick,
} from '@/lib/utils';
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
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useAnchorProgram } from '@/hooks/useAnchorProgram';
import { getExplorerLink } from '@solana-developers/helpers';
import { Cluster, Transaction } from '@solana/web3.js';
import { uploadFile } from '@/actions';

export default function Page() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const { getCreateProfileIx } = useAnchorProgram();
  const [profileImageUri, setProfileImageUri] = useState<string>('');
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
    if (publicKey && !form.getValues('profileImage')) {
      const uri = generateDicebearAvatarUri({
        seed: publicKey.toBase58(),
        style: 'profile',
      });

      setProfileImageUri(uri);
    }
  }, [publicKey, form]);

  async function onSubmit(values: z.infer<typeof createProfileFormSchema>) {
    try {
      setIsUploading(true);
      const [uploadedImageUri] = await uploadFile([profileImageUri]);
      setIsUploading(false);
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();
      const ix = await getCreateProfileIx(values.name, uploadedImageUri);
      const tx = new Transaction().add(ix);
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
          process.env.NEXT_PUBLIC_CLUSTER! as Cluster
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
                      {profileImageUri ? (
                        <Image
                          src={profileImageUri}
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
                          setProfileImageUri
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
