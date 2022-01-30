import { AccountInfo } from '@solana/spl-token';
import { Keypair, PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';

export type TransactionPair = { from: Keypair; to: PublicKey };
export const environment: 'local' | 'devnet' = 'devnet';

export interface IAccountState {
  publicKey?: string;
  privateKey?: string;
  balance?: number;
  subWalletKey?: string;
  subWalletBalance?: number;
}

export type UxState = 'initial' | 'loading' | 'done';

export class AccountState implements IAccountState {
  publicKey?: string;
  privateKey?: string;
  balance?: number;
  subWalletKey?: string;
  subWalletBalance?: number;

  public updateFrom(accountInfo: AccountInfo): AccountState {
    this.subWalletBalance = accountInfo.amount.toNumber();
    this.subWalletKey = accountInfo.address.toBase58();
    return this;
  }

  constructor(from: PublicKey | Keypair) {
    if (from instanceof Keypair) {
      this.publicKey = from.publicKey.toBase58();
      this.privateKey = bs58.encode(from.secretKey);
      return;
    }
    if (!(from instanceof PublicKey)) {
      throw Error('Expected argument to be PublicKey');
    }
    this.publicKey = from.toBase58();
  }
}

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
