'use server';

import { CONNECTION, RUMA_WALLET } from '@/lib/constants';
import { Uploader } from '@irys/upload';
import { Solana } from '@irys/upload-solana';
import bs58 from 'bs58';

const base58 = bs58.encode(RUMA_WALLET.secretKey);
const irysUploader = await Uploader(Solana)
  .withWallet(base58)
  .withRpc(CONNECTION.rpcEndpoint)
  .devnet();

export async function upload(dataUri: File): Promise<string> {
  const price = await irysUploader.getPrice(dataUri.size);
  await irysUploader.fund(price);

  const response = await irysUploader.upload(
    Buffer.from(await dataUri.arrayBuffer()),
    {
      tags: [
        {
          name: 'Content-Type',
          value: dataUri.type,
        },
        {
          name: 'Filename',
          value: dataUri.name,
        },
      ],
    }
  );

  const link = `https://gateway.irys.xyz/${response.id}`;
  console.log(`Uploaded to ${link}`);
  return link;
}
