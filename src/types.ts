import { Keypair, PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';

export type TransactionPair = { from: Keypair; to: PublicKey };
export const environment: 'local' | 'devnet' = 'devnet';
export type AppState = {
  count: number;
  tokenPubKey: string;
  environment: typeof environment;
  ownerPublicKey: string;
  ownerPrivateKey: string;
  recieiverPublicKey: string;
  ownerSubWallet: string;
  recieverSubWallet: string;
};

export const defaultAppState: AppState = {
  count: 0,
  tokenPubKey: '',
  environment,
  ownerPrivateKey: '',
  ownerPublicKey: '',
  recieiverPublicKey: '',
  ownerSubWallet: '',
  recieverSubWallet: '',
};

export type SetState = (state: Partial<AppState>) => void;

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
