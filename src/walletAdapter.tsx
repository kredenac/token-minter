import React, { useCallback, useMemo, useState } from 'react';
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

import '@solana/wallet-adapter-react-ui/styles.css';

export const Wallet = (props: {
  children?: React.ReactNode;
  network: WalletAdapterNetwork;
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
          {props.children}
          <ExecutePayment />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { createMintingTransaction } from './genesis';
import { explorerLink } from './types';
import { TokenForm } from './TokenForm';

type ExecutePaymentProps = {
  setMintAddress: (mint: string) => void;
  setAssocciatedAddress: (assoc: string) => void;
  setPaymentContext: (
    wallet: Partial<WalletContextState>,
    connection: Connection
  ) => void;
};

export const ExecutePayment = (props: ExecutePaymentProps) => {
  // const { publicKey, sendTransaction, signTransaction } = useWallet();
  const wallet = useWallet();
  const { connection } = useConnection();

  // props.setPaymentContext(wallet, connection);

  // const onClick = useCallback(async () => {
  //   if (!publicKey) throw new WalletNotConnectedError('no pubkey');
  //   if (!signTransaction)
  //     throw new WalletNotConnectedError('no sign transaction');

  //   const { transaction, associatedAddress, mintKeypair } =
  //     await createMintingTransaction({ publicKey, connection });

  //   const signature = await sendTransaction(transaction, connection, {
  //     signers: [mintKeypair],
  //   });

  //   await connection.confirmTransaction(signature, 'processed');

  //   props.setAssocciatedAddress(associatedAddress.toBase58());
  //   props.setMintAddress(mintKeypair.publicKey.toBase58());
  // }, [publicKey, sendTransaction, connection]);

  if (wallet.publicKey) {
    return <TokenForm onSumbmit={() => console.log('top submit')}></TokenForm>;
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
