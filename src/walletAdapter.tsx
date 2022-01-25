import React, { FC, useCallback, useMemo } from 'react';
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
import {
  clusterApiUrl,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';

import '@solana/wallet-adapter-react-ui/styles.css';

export const Wallet = () => {
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
          <WalletMultiButton />
          <WalletDisconnectButton />
          {/* Your app's components go here, nested within the context providers. */}
          <ExecutePayment />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  MintLayout,
  Token,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

const existingTokenMint = new PublicKey(
  '8nbcuhuwXyVapFN559XPbTisJFMU6vfTvYLnj9v4x1xV'
);
export const ExecutePayment = () => {
  const { publicKey, sendTransaction, signTransaction } = useWallet();

  const { connection } = useConnection();
  const onClick = useCallback(async () => {
    if (!publicKey) throw new WalletNotConnectedError('no pubkey');
    if (!signTransaction)
      throw new WalletNotConnectedError('no sign transaction');

    const mintKeypair = Keypair.generate();

    const rent = await connection.getMinimumBalanceForRentExemption(
      MintLayout.span
    );

    const associatedAddress = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      mintKeypair.publicKey,
      publicKey
    );

    console.log('associated address,', associatedAddress.toBase58());

    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: publicKey,
        newAccountPubkey: mintKeypair.publicKey,
        space: MintLayout.span,
        lamports: rent,
        programId: TOKEN_PROGRAM_ID,
      }),
      Token.createInitMintInstruction(
        TOKEN_PROGRAM_ID,
        mintKeypair.publicKey,
        5,
        publicKey,
        null
      ),
      Token.createAssociatedTokenAccountInstruction(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        mintKeypair.publicKey,
        associatedAddress,
        publicKey,
        publicKey
      ),
      // create minttoinstruction
      Token.createMintToInstruction(
        TOKEN_PROGRAM_ID,
        mintKeypair.publicKey,
        associatedAddress,
        publicKey,
        [],
        17
      )
    );

    const signature = await sendTransaction(transaction, connection, {
      signers: [mintKeypair], // ovo me jebalo
    });

    await connection.confirmTransaction(signature, 'processed');

    console.log('new mint:', mintKeypair.publicKey.toBase58());
  }, [publicKey, sendTransaction, connection]);

  return (
    <button onClick={onClick} disabled={!publicKey}>
      Just do it
    </button>
  );
};

export function connectWalletAdapter() {
  return 'lmao';
}
