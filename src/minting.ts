import * as web3 from '@solana/web3.js';
import { Keypair, PublicKey } from '@solana/web3.js';
import { mnemonicToSeedSync } from 'bip39';
import {
  createToken,
  mintNewCoinsOnToken,
  updateMintAndAccountInfo,
} from './genesis';
import keys from '../devnetkeys.json';
import bs58 from 'bs58';
import {
  AccountState,
  AppState,
  environment,
  SetState,
  TransactionPair,
} from './types';

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

  setState((state: AppState) => ({ currentSteps: state.currentSteps + 1 }));
  const newToken = await createToken(connection, pair);
  setState({ tokenPubKey: newToken.publicKey.toBase58() });
  setState((state: AppState) => ({ currentSteps: state.currentSteps + 1 }));

  await mintNewCoinsOnToken(
    connection,
    newToken.publicKey,
    pair.from,
    pair.to,
    setState
  );

  await updateMintAndAccountInfo(setState, newToken, pair.from.publicKey);
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
