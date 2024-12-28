'use server';

import { CONNECTION } from '@/lib/constants';
import { PublicKey as UmiPublicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  DigitalAsset,
  fetchDigitalAsset,
  fetchMasterEdition,
  fetchMetadata,
  findMasterEditionPda,
  findMetadataPda,
  MasterEdition,
  Metadata,
} from '@metaplex-foundation/mpl-token-metadata';
import { fromWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters';
import { PublicKey } from '@solana/web3.js';

const umi = createUmi(CONNECTION.rpcEndpoint, 'confirmed');

export async function getMasterEditionPda(
  masterMintPubkey: PublicKey
): Promise<UmiPublicKey> {
  return findMasterEditionPda(umi, {
    mint: fromWeb3JsPublicKey(masterMintPubkey),
  })[0];
}

export async function getMasterEditionAcc(
  masterEditionPda: UmiPublicKey
): Promise<MasterEdition> {
  return await fetchMasterEdition(umi, masterEditionPda);
}

export async function getEditionAcc(
  editionMintPubkey: PublicKey
): Promise<DigitalAsset> {
  return await fetchDigitalAsset(umi, fromWeb3JsPublicKey(editionMintPubkey));
}

export async function getMetadataPda(
  masterMintPubkey: PublicKey
): Promise<UmiPublicKey> {
  return findMetadataPda(umi, {
    mint: fromWeb3JsPublicKey(masterMintPubkey),
  })[0];
}

export async function getMetadataAcc(
  metadataPda: UmiPublicKey
): Promise<Metadata> {
  return await fetchMetadata(umi, metadataPda);
}
