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

export async function createMintingTransaction(args: {
  publicKey: PublicKey;
  connection: Connection;
  decimals: number;
  amount: number;
}): Promise<{
  transaction: Transaction;
  associatedAddress: PublicKey;
  mintKeypair: Keypair;
}> {
  const mintKeypair = Keypair.generate();
  const { publicKey, decimals, amount } = args;

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
      decimals,
      publicKey,
      publicKey
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
      // amount is counted in lowest denominator
      amount * 10 ** decimals
    )
  );

  return { transaction, mintKeypair, associatedAddress };
}
