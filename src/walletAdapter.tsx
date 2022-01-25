import React, { useCallback, useMemo, useState } from 'react';
import {
  ConnectionProvider,
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
import { clusterApiUrl } from '@solana/web3.js';

import '@solana/wallet-adapter-react-ui/styles.css';

export const Wallet = (props: { children: React.ReactNode }) => {
  const network = WalletAdapterNetwork.Devnet;
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
          <WalletDisconnectButton />
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

export const ExecutePayment = () => {
  const { publicKey, sendTransaction, signTransaction } = useWallet();
  const [assocAddr, setAssocAddr] = useState('');
  const [mintAddr, setMintAddr] = useState('');

  const { connection } = useConnection();
  const onClick = useCallback(async () => {
    if (!publicKey) throw new WalletNotConnectedError('no pubkey');
    if (!signTransaction)
      throw new WalletNotConnectedError('no sign transaction');

    const { transaction, associatedAddress, mintKeypair } =
      await createMintingTransaction({ publicKey, connection });

    const signature = await sendTransaction(transaction, connection, {
      signers: [mintKeypair],
    });

    await connection.confirmTransaction(signature, 'processed');

    setAssocAddr(associatedAddress.toBase58());
    setMintAddr(mintKeypair.publicKey.toBase58());
  }, [publicKey, sendTransaction, connection]);

  console.log(publicKey);
  return (
    <div style={{ marginTop: '10px' }}>
      <button
        onClick={onClick}
        disabled={!publicKey}
        className={(publicKey ? 'just-do-it' : '') + ' wallet-adapter-button'}
      >
        {publicKey
          ? 'Create your new Token!'
          : 'Connect wallet to create new Token'}
      </button>
      {assocAddr && <p>Assocciated Wallet Address {assocAddr}</p>}
      {assocAddr && <p>Your New Token Address {mintAddr}</p>}
    </div>
  );
};

export function connectWalletAdapter() {
  return 'lmao';
}
