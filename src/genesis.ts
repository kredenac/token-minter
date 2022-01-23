import * as web3 from '@solana/web3.js';
import { PublicKey, Connection, Keypair } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, Token } from '@solana/spl-token';
import { SetState, stringifySafe, TransactionPair } from './types';

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

export async function mintNewCoinsOnToken(
  connection: Connection,
  mintAddress: PublicKey,
  payer: Keypair,
  dest: PublicKey,
  setState: SetState
) {
  const token = new Token(connection, mintAddress, TOKEN_PROGRAM_ID, payer);

  // getting or creating (if doens't exist) the token address in the fromWallet address
  // fromTokenAccount is essentially the account *inside* the fromWallet that will be able to handle the              new token that we just minted
  const fromTokenAccount = await token.getOrCreateAssociatedAccountInfo(
    payer.publicKey
  );

  // fromTokenAccount.amount

  const mintInfo = await token.getMintInfo();

  setState((state) => ({
    owner: state.owner!.updateFrom(fromTokenAccount),
    mintInfo,
  }));

  // getting or creating (if doens't exist) the token address in the toWallet address
  // toWallet is the creator: the og mintRequester
  // toTokenAmount is essentially the account *inside* the mintRequester's (creator's) wallet that will be able to handle the new token that we just minted
  // const toTokenAccount = await token.getOrCreateAssociatedAccountInfo(dest);

  await token.mintTo(
    fromTokenAccount.address,
    payer,
    [],
    10 ** mintInfo.decimals
  );
}

// How to transfer custom token: https://stackoverflow.com/questions/68236211/how-to-transfer-custom-token-by-solana-web3-js

// Useful for minting: https://stackoverflow.com/questions/68215033/i-would-like-to-mint-a-new-token-on-solana-how-can-i-do-this-using-solana-web3
