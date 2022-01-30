import * as web3 from '@solana/web3.js';
import {
  PublicKey,
  Connection,
  Keypair,
  Transaction,
  SystemProgram,
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  Token,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  MintLayout,
} from '@solana/spl-token';
import { AppState, SetState, stringifySafe, TransactionPair } from './types';
import { useConnection } from '@solana/wallet-adapter-react';

export async function createMintingTransaction(args: {
  publicKey: PublicKey;
  connection: Connection;
}): Promise<{
  transaction: Transaction;
  associatedAddress: PublicKey;
  mintKeypair: Keypair;
}> {
  const mintKeypair = Keypair.generate();
  const { publicKey } = args;

  const associatedAddress = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    mintKeypair.publicKey,
    publicKey
  );
  const rent = await args.connection.getMinimumBalanceForRentExemption(
    MintLayout.span
  );

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
      5, // TODO variable
      publicKey,
      null // TODO variable
    ),
    Token.createAssociatedTokenAccountInstruction(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      mintKeypair.publicKey,
      associatedAddress,
      publicKey,
      publicKey
    ),
    Token.createMintToInstruction(
      TOKEN_PROGRAM_ID,
      mintKeypair.publicKey,
      associatedAddress,
      publicKey,
      [],
      17
    )
  );

  return { transaction, mintKeypair, associatedAddress };
}

export async function airdrop(connection: Connection, to: PublicKey) {
  const airdropSignature = await connection.requestAirdrop(
    to,
    web3.LAMPORTS_PER_SOL
  );
  const result = await connection.confirmTransaction(airdropSignature);
  console.log('result of aidrop:', airdropSignature, JSON.stringify(result));
}

export async function createToken(
  connection: Connection,
  pair: TransactionPair
): Promise<Token> {
  const mintPublicKey = Keypair.generate().publicKey;
  console.log('mint pkey:', mintPublicKey.toBase58());

  const token = await Token.createMint(
    connection,
    pair.from,
    pair.from.publicKey,
    null,
    5,
    TOKEN_PROGRAM_ID
  );

  console.log(stringifySafe(token));

  return token;
}

export async function mintNewCoinsOnToken(
  connection: Connection,
  mintAddress: PublicKey,
  payer: Keypair,
  dest: PublicKey,
  setState: SetState
) {
  // TODO: check if it needs to be created again, or we can reuse it from before
  const token = new Token(connection, mintAddress, TOKEN_PROGRAM_ID, payer);

  // getting or creating (if doens't exist) the token address in the fromWallet address
  // fromTokenAccount is essentially the account *inside* the fromWallet for the new token
  const fromTokenAccount = await token.getOrCreateAssociatedAccountInfo(
    payer.publicKey
  );

  setState((state: AppState) => ({ currentSteps: state.currentSteps + 1 }));

  const mintInfo = await token.getMintInfo();

  setState((state) => ({
    owner: state.owner!.updateFrom(fromTokenAccount),
    mintInfo,
    currentSteps: state.currentSteps + 1,
  }));

  await token.mintTo(
    fromTokenAccount.address,
    payer.publicKey,
    [],
    37 * 10 ** mintInfo.decimals
  );

  console.log('minted coins');
  setState((state: AppState) => ({ currentSteps: state.currentSteps + 1 }));
}

export async function updateMintAndAccountInfo(
  setState: SetState,
  token: Token,
  accToUpdate: PublicKey
) {
  const mintInfoAFter = await token.getMintInfo();
  console.log('Updated mint info');
  setState({ mintInfo: mintInfoAFter });
  setState((state: AppState) => ({ currentSteps: state.currentSteps + 1 }));

  const fromTokenAccount = await token.getOrCreateAssociatedAccountInfo(
    accToUpdate
  );
  setState((state) => ({
    owner: state.owner!.updateFrom(fromTokenAccount),
  }));
  setState((state: AppState) => ({ currentSteps: state.currentSteps + 1 }));
  console.log('Updated account info');
}

// mint with wallet https://codesandbox.io/s/bc0ly?file=/src/candy-machine.ts

// How to transfer custom token: https://stackoverflow.com/questions/68236211/how-to-transfer-custom-token-by-solana-web3-js

// Useful for minting: https://stackoverflow.com/questions/68215033/i-would-like-to-mint-a-new-token-on-solana-how-can-i-do-this-using-solana-web3
