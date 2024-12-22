import { Ruma } from '@/types/ruma';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { useMemo, useState } from 'react';
import idl from '@/idl/ruma.json';

export function useAnchorProgram() {
  const [program, setProgram] = useState<Program<Ruma> | null>(null);
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  useMemo(() => {
    if (wallet) {
      const provider = new AnchorProvider(connection, wallet, {
        commitment: 'confirmed',
      });
      setProgram(new Program(idl as unknown as Ruma, provider));
    }
  }, [connection, wallet]);

  return { program };
}
