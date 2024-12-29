import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { UseFormReturn } from 'react-hook-form';
import { RefObject } from 'react';
import {
  AddressLookupTableAccount,
  ComputeBudgetProgram,
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import { getSimulationComputeUnits } from '@solana-developers/helpers';
import { DisplayedEvent } from '@/types/event';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleImageChange(
  event: React.ChangeEvent<HTMLInputElement>,
  form: UseFormReturn<any, any, undefined>,
  formFieldName: string,
  setProfileImageUri: (image: string) => void
) {
  const file = event.target.files?.[0];

  if (file) {
    form.setValue(formFieldName, file);

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setProfileImageUri(reader.result as string);
    };
  }
}

export function handleImageClick(ref: RefObject<HTMLInputElement>) {
  ref.current?.click();
}

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export async function setComputeUnitLimitAndPrice(
  connection: Connection,
  instructions: TransactionInstruction[],
  payer: PublicKey,
  lookupTables: Array<AddressLookupTableAccount> = []
): Promise<Transaction> {
  const tx = new Transaction();

  const units = await getSimulationComputeUnits(
    connection,
    instructions,
    payer,
    lookupTables
  );

  if (units) {
    tx.add(
      ComputeBudgetProgram.setComputeUnitLimit({
        units: Math.ceil(units * 1.1),
      })
    );
  }

  const recentFees = await connection.getRecentPrioritizationFees();
  const priorityFee =
    recentFees.reduce(
      (acc, { prioritizationFee }) => acc + prioritizationFee,
      0
    ) / recentFees.length;

  tx.add(
    ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: BigInt(Math.ceil(priorityFee)),
    }),
    ...instructions
  );

  return tx;
}

export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.set('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Failed to upload image.');
  }

  const { link } = await response.json();
  return link;
}

export function sortEventsByTimestamp(events: DisplayedEvent[]): DisplayedEvent[] {
  return events.sort((a, b) => Number(a.event.account.data.startTimestamp) - Number(b.event.account.data.startTimestamp));
}
