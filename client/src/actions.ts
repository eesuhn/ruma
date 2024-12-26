'use server';

import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
} from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';
import { clusterApiUrl } from '@solana/web3.js';

const umi = createUmi(
  process.env.NEXT_PUBLIC_RPC_URL ?? clusterApiUrl('devnet'),
  'confirmed'
).use(irysUploader());

const keypair = umi.eddsa.createKeypairFromSecretKey(
  new Uint8Array(JSON.parse(process.env.NEXT_PUBLIC_RUMA_WALLET!))
);
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(signer));

/**
 * Uploads a data URI to Irys
 * @param {string} dataUri
 * @returns {Promise<string>} Uploaded URI
 */
export async function uploadFile(dataUriArr: string[]): Promise<string[]> {
  const files = dataUriArr.map((dataUri) =>
    createGenericFile(dataUri, 'image', {
      contentType: 'image/svg+xml',
    })
  );

  return await umi.uploader.upload(files);
}
