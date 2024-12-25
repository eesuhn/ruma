import { createGenericFile, Umi } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useMemo, useState } from 'react';

export default function useUmi() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [umi, setUmi] = useState<Umi>(
    createUmi(connection.rpcEndpoint, 'confirmed')
      .use(irysUploader())
      .use(mplTokenMetadata())
  );

  useMemo(() => {
    if (wallet) {
      setUmi(umi.use(walletAdapterIdentity(wallet)));
    }
  }, [wallet, umi]);

  async function uploadFile(avatarUri: string): Promise<string> {
    const file = createGenericFile(avatarUri, 'image', {
      contentType: 'image/svg+xml',
    });

    const [uri] = await umi.uploader.upload([file]);

    return uri;
  }

  return {
    uploadFile
  };
}
