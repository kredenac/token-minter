import * as web3 from '@solana/web3.js';
import { sendAndConfirmTransaction, Keypair } from '@solana/web3.js';
import { mnemonicToSeedSync } from 'bip39';

export async function startMinting() {
  const connection = new web3.Connection(
    ////web3.clusterApiUrl('devnet'),
    'http://localhost:8899',
    'confirmed'
  );

  let slot = await connection.getSlot();
  console.log(slot);

  let blockTime = await connection.getBlockTime(slot);
  console.log(blockTime);

  const mnemonic =
    'taxi tissue you table top record require casual much acquire car another';
  const seed = mnemonicToSeedSync(mnemonic, 'lmao');

  const from = Keypair.fromSeed(seed.slice(0, 32));

  const to = new web3.PublicKey('ERjAANERSzd3byPWhim4AmvN1D1mqu3SABiqWJxUThX2'); // Keypair.generate();
  console.log('sending to', to.toBase58());

  const tx = new web3.Transaction({ feePayer: from.publicKey });
  tx.add(
    web3.SystemProgram.transfer({
      fromPubkey: from.publicKey,
      toPubkey: to,
      lamports: web3.LAMPORTS_PER_SOL,
    })
  );

  const result = await sendAndConfirmTransaction(connection, tx, [from]);

  console.log('result', result);
  const account = await connection.getAccountInfo(to);

  console.log('your account info', JSON.stringify(account, null, 2));
}
