import * as web3 from '@solana/web3.js';
import {
  sendAndConfirmTransaction,
  Keypair,
  Connection,
  PublicKey,
} from '@solana/web3.js';
import { mnemonicToSeedSync } from 'bip39';
// import { airdrop } from './airdrop';
import keys from '../devnetkeys.json';
import bs58 from 'bs58';

const environmet: 'local' | 'devnet' = 'local';

export type TransactionPair = { from: Keypair; to: PublicKey };

export async function startMinting() {
  console.log(keys);

  const connection = new web3.Connection(
    web3.clusterApiUrl('devnet'),
    // 'http://localhost:8899',
    'confirmed'
  );

  await getTestDataFrom(connection);

  const pair = getFromAndTo();
  // if (Math.random()) return;

  await performTransaction(connection, pair);
  // await airdrop(connection, pair.to);
}

function getFromAndTo(): TransactionPair {
  if (environmet === 'devnet') {
    const mnemonic =
      'taxi tissue you table top record require casual much acquire car another';
    const seed = mnemonicToSeedSync(mnemonic, 'lmao');

    const from = Keypair.fromSeed(seed.slice(0, 32));

    const to = new PublicKey('ERjAANERSzd3byPWhim4AmvN1D1mqu3SABiqWJxUThX2');
    return { from, to };
  }

  const decoded = new Uint8Array(bs58.decode(keys.private));

  return {
    from: Keypair.fromSecretKey(decoded),
    to: new PublicKey(keys.to),
  };
}

async function getTestDataFrom(connection: Connection) {
  let slot = await connection.getSlot();
  console.log(slot);

  let blockTime = await connection.getBlockTime(slot);
  console.log(blockTime);
}

async function performTransaction(
  connection: Connection,
  pair: TransactionPair
) {
  const { from, to } = pair;
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
