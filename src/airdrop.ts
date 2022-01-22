import * as web3 from '@solana/web3.js';
import { PublicKey, Connection } from '@solana/web3.js';

export async function aidrop(connection: Connection, to: PublicKey) {
  const airdropSignature = await connection.requestAirdrop(
    to,
    web3.LAMPORTS_PER_SOL
  );
  const result = await connection.confirmTransaction(airdropSignature);
}
