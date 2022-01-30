import React, { useEffect, useMemo } from 'react';
import {
  ConnectionProvider,
  WalletContextState,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl, Connection } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { explorerLink } from './types';
import { TokenForm } from './TokenForm';
import '@solana/wallet-adapter-react-ui/styles.css';

export const Wallet = (props: {
  children?: React.ReactNode;
  network: WalletAdapterNetwork;
  payment: ExecutePaymentProps;
}) => {
  const { network } = props;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      new SolletWalletAdapter({ network }),
      new SolletExtensionWalletAdapter({ network }),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div style={{ marginBottom: '10px' }}>
            <WalletMultiButton />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <WalletDisconnectButton />
          </div>
          <ExecutePayment {...props.payment}>{props.children} </ExecutePayment>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

type ExecutePaymentProps = {
  setPaymentContext: (
    wallet: WalletContextState,
    connection: Connection
  ) => void;
};

export const ExecutePayment = (
  props: ExecutePaymentProps & { children: React.ReactNode }
) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  useEffect(
    () => props.setPaymentContext(wallet, connection),
    [wallet, connection]
  );

  if (wallet.publicKey && props.children) {
    return <>{props.children}</>;
  }

  return (
    <>
      <p>Connect wallet to create new Token</p>
      {/* {mintAddr && <Output hash={mintAddr} title={'New Token'} />}
      {assocAddr && (
        <Output hash={assocAddr} title={'Wallet containing new Token'} />
      )} */}
    </>
  );
};

function Output(props: { title: string; hash: string }) {
  return (
    <a
      href={explorerLink(props.hash)}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-info output"
    >
      {props.title}
    </a>
  );
}
