import * as web3 from '@solana/web3.js';
import {
  sendAndConfirmTransaction,
  Keypair,
  Connection,
  PublicKey,
} from '@solana/web3.js';
import { mnemonicToSeedSync } from 'bip39';
import { createToken, mintNewCoinsOnToken } from './genesis';
import keys from '../devnetkeys.json';
import bs58 from 'bs58';
import { AccountState, environment, SetState, TransactionPair } from './types';

export async function startMinting(setState: SetState) {
  const connection = new web3.Connection(
    environment === 'devnet'
      ? web3.clusterApiUrl('devnet')
      : 'http://localhost:8899',
    'confirmed'
  );

  const pair = getFromAndTo();
  setState({
    owner: new AccountState(pair.from),
    reciever: new AccountState(pair.to),
  });

  const newTokenPub = await createToken(connection, pair);
  setState({ tokenPubKey: newTokenPub.toBase58() });

  await mintNewCoinsOnToken(
    connection,
    newTokenPub,
    pair.from,
    pair.to,
    setState
  );
}

function getFromAndTo(): TransactionPair {
  if (environment === 'local') {
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
