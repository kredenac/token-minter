import * as web3 from '@solana/web3.js';

export async function startMinting() {
  const connection = new web3.Connection(
    web3.clusterApiUrl('devnet'),
    'confirmed'
  );

  const wallet = web3.Keypair.generate();

  const airdropSignature = await connection.requestAirdrop(
    wallet.publicKey,
    web3.LAMPORTS_PER_SOL
  );

  const result = await connection.confirmTransaction(airdropSignature);
  console.log('result', result);
  const account = await connection.getAccountInfo(wallet.publicKey);
  console.log(
    'your account info',
    'data:',
    account?.data.toString(),
    'owner:',
    account?.owner.toBase58()
  );
}
