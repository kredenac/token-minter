import { TransactionPair } from './types';
import {
  Connection,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';

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
  const tx = new Transaction({ feePayer: from.publicKey });
  tx.add(
    SystemProgram.transfer({
      fromPubkey: from.publicKey,
      toPubkey: to,
      lamports: LAMPORTS_PER_SOL,
    })
  );

  const result = await sendAndConfirmTransaction(connection, tx, [from]);

  console.log('result', result);
  const account = await connection.getAccountInfo(to);

  console.log('your account info', JSON.stringify(account, null, 2));
}
