import { NextPage } from "next";
import { FC, ReactNode, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import {
  clusterApiUrl,
  Transaction,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";
 
const walletadpt: NextPage = props => {
  const endpoint = clusterApiUrl("devnet");
  const wallets = useMemo(() => [], []);
 
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>
        <WalletModalProvider>
          <WalletMultiButton className="bg-blue-200" />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
 
export default walletadpt;