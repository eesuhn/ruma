import { Umi } from "@metaplex-foundation/umi";
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useMemo, useState } from "react";

export default function useUmi() {
  const { connection } = useConnection();
  const [umi, setUmi] = useState<Umi>(
    createUmi(connection.rpcEndpoint, 'confirmed')
      .use(irysUploader())
      .use(mplTokenMetadata())
  );
  const wallet = useWallet();

  useMemo(() => {
    if (wallet) {
      setUmi(umi.use(walletAdapterIdentity(wallet)));
    }
  }, [wallet, umi]);

  return { umi };
}