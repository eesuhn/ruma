'use server';

import { CONNECTION } from '@/lib/constants';
import {
  createGenericFile,
  createSignerFromKeypair,
  PublicKey as UmiPublicKey,
  signerIdentity,
} from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';
import { DigitalAsset, fetchDigitalAsset, fetchMasterEdition, findMasterEditionPda, MasterEdition } from '@metaplex-foundation/mpl-token-metadata';
import { fromWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters';
import { PublicKey } from '@solana/web3.js';

const umi = createUmi(
  CONNECTION.rpcEndpoint,
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

export function getMasterEditionPda(masterMintPubkey: PublicKey): UmiPublicKey {
  return findMasterEditionPda(umi, {
    mint: fromWeb3JsPublicKey(masterMintPubkey),
  })[0];
}

export async function getMasterEditionAcc(masterEditionPda: UmiPublicKey): Promise<MasterEdition> {
  return await fetchMasterEdition(umi, masterEditionPda);
}

export async function getEditionAcc(editionMintPubkey: PublicKey): Promise<DigitalAsset> {
  return await fetchDigitalAsset(
    umi,
    fromWeb3JsPublicKey(editionMintPubkey)
  )
}
