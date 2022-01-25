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
  SystemInstruction,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
} from '@solana/web3.js';

import '@solana/wallet-adapter-react-ui/styles.css';

export const Wallet = () => {
  const network = WalletAdapterNetwork.Testnet;
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
import base58 from 'bs58';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  MintLayout,
  Token,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { getFromAndTo } from './minting';

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

    // if (!signMessage) throw new Error('sign message undefined');
    // console.log('signed by', base58.encode(result));
    // if (Math.random()) return;

    // only this works
    // const transaction = new Transaction().add(
    //   SystemProgram.transfer({
    //     fromPubkey: publicKey,
    //     toPubkey: Keypair.generate().publicKey,
    //     lamports: 1,
    //   })
    // );

    const mintKeypair = Keypair.generate();
    const mintPublicKey = mintKeypair.publicKey;
    console.log('mint pkey:', mintPublicKey.toBase58());

    const rent = await connection.getMinimumBalanceForRentExemption(
      MintLayout.span
    );
    console.log('rent:', rent);

    const keypair = getFromAndTo();

    // const token = await Token.createMint(
    //   connection,
    //   keypair.from,
    //   keypair.from.publicKey,
    //   null,
    //   5,
    //   TOKEN_PROGRAM_ID // TODO what's the diff?
    // );
    // console.log('token succeeded');
    // if (Math.random()) return;

    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: publicKey,
        newAccountPubkey: mintPublicKey,
        space: MintLayout.span,
        lamports: rent,
        programId: TOKEN_PROGRAM_ID,
      })
      //   Token.createInitMintInstruction(
      //     TOKEN_PROGRAM_ID,
      //     mintPublicKey, //publicKey, //mintPublicKey,
      //     5,
      //     publicKey,
      //     publicKey
      //   )
      // Token.createAssociatedTokenAccountInstruction(
      //     ASSOCIATED_TOKEN_PROGRAM_ID,
      //     TOKEN_PROGRAM_ID,

      // )
    );

    // === manual window test start
    // const solana = (window as any).solana;
    // const resp = await solana.request({ method: 'connect' });
    // console.log('resp', resp.publicKey.toString());
    // const bh = (await connection.getRecentBlockhash()).blockhash;
    // console.log('bh', bh);
    // transaction.recentBlockhash = bh;
    // transaction.feePayer = publicKey;
    // console.log('before signature');
    // const { signature } = await solana.signAndSendTransaction(transaction);
    // === manual window test start

    // transaction.recentBlockhash = (
    //   await connection.getRecentBlockhash()
    // ).blockhash;
    // transaction.feePayer = publicKey;

    const signature = await sendTransaction(transaction, connection, {
      signers: [mintKeypair],
    });
    console.log('after signature');

    await connection.confirmTransaction(signature, 'processed');
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
