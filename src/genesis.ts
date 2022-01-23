import * as web3 from '@solana/web3.js';
import { PublicKey, Connection } from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  Token,
} from '@solana/spl-token';
import { stringifySafe, TransactionPair } from './types';
import bs58 from 'bs58';

export async function airdrop(connection: Connection, to: PublicKey) {
  const airdropSignature = await connection.requestAirdrop(
    to,
    web3.LAMPORTS_PER_SOL
  );
  const result = await connection.confirmTransaction(airdropSignature);
  console.log('result of aidrop:', airdropSignature, JSON.stringify(result));
}

const tokenMintAddr = '5MnCte1YpjDeokcruw4ooYvHM8m6fHvw2KhmF3wS4rDZ';
export async function createToken(
  connection: Connection,
  pair: TransactionPair
): Promise<web3.PublicKey> {
  if (tokenMintAddr) {
    return new PublicKey(tokenMintAddr);
  }
  // todo check ASSOCIATED_TOKEN_PROGRAM_ID - determine subwallet
  const mint = web3.Keypair.generate().publicKey;
  console.log('mint:', mint);
  // const token = new Token(
  //   connection,
  //   mint,
  //   ASSOCIATED_TOKEN_PROGRAM_ID,
  //   pair.from
  // );

  const token = await Token.createMint(
    connection,
    pair.from,
    pair.from.publicKey,
    null,
    5,
    TOKEN_PROGRAM_ID
  );
  // const fromTokenAccount = await token.getOrCreateAssociatedAccountInfo(
  //   pair.from.publicKey
  // );

  console.log(stringifySafe(token));
  return token.publicKey;
}

// How to transfer custom token: https://stackoverflow.com/questions/68236211/how-to-transfer-custom-token-by-solana-web3-js
