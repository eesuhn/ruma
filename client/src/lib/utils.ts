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

export const statusStyles = {
  going: 'bg-[#79be79] text-white',
  pending: 'bg-[#f77f00] text-white',
  rejected: 'bg-[#e5383b] text-white',
  'checked-in': 'bg-[#91d1ce] text-white',
} as const;

export const formatStatus = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
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
