import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

export type UxState = 'initial' | 'loading' | 'done';

export function stringifySafe(obj: any, spacing: number = 2): string {
  return JSON.stringify(
    obj,
    (key, value) => {
      if (key === 'connection') {
        return 'Preventing Circular Dependency';
      }

      const keypair = value._keypair as Keypair;
      if (keypair) {
        return {
          publicKey: bs58.encode(keypair.publicKey as any),
          secretKey: bs58.encode(keypair.secretKey),
        };
      }

      return value;
    },
    spacing
  );
}

export function explorerLink(address: string) {
  return `https://explorer.solana.com/address/${address}?cluster=devnet`;
}
