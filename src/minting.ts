import * as web3 from '@solana/web3.js';
import { Keypair, PublicKey } from '@solana/web3.js';
import { mnemonicToSeedSync } from 'bip39';
import keys from '../devnetkeys.json';
import bs58 from 'bs58';
import { AccountState, environment, TransactionPair } from './types';

export async function startMinting() {
  // if (connectWalletAdapter()) {
  //   return;
  // }

  const connection = new web3.Connection(
    environment === 'devnet'
      ? web3.clusterApiUrl('devnet')
      : 'http://localhost:8899',
    'confirmed'
  );

  // const pair = getFromAndTo();

  // const newToken = await createToken(connection, pair);

  // await mintNewCoinsOnToken(connection, newToken.publicKey, pair.from, pair.to);

  // await updateMintAndAccountInfo(newToken, pair.from.publicKey);
}

export function getFromAndTo(): TransactionPair {
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
