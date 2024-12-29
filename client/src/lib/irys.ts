import { CONNECTION, RUMA_WALLET } from '@/lib/constants';
import { Uploader } from '@irys/upload';
import { Solana } from '@irys/upload-solana';
import bs58 from 'bs58';

export const irysUploader = await Uploader(Solana)
  .withWallet(bs58.encode(RUMA_WALLET.secretKey))
  .withRpc(CONNECTION.rpcEndpoint)
  .devnet();
