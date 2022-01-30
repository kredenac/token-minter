import logo from './imgs/solana-sol-logo.svg';
import './App.css';
import { explorerLink, IAccountState } from './types';
import { MintInfo } from '@solana/spl-token';
import { Wallet } from './walletAdapter';
import React from 'react';
import {
  WalletAdapterNetwork,
  WalletNotConnectedError,
} from '@solana/wallet-adapter-base';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import { createMintingTransaction } from './genesis';
import { defineTokenForListing } from './github';
import { TokenInfo } from '@uniswap/token-lists';
import { TokenForm } from './TokenForm';
import { PullRequester } from './PrMaker';

export type AppState = {
  tokenPubKey?: string;
  network: WalletAdapterNetwork;
  mintAddr?: string;
  associatedAccount?: string;
  wallet?: WalletContextState;
  connection?: Connection;
  tokenInfo?: BonusTokenInfo;
};

export type BonusTokenInfo = {
  symbol: string;
  name: string;
  decimals: number;
  imageUrl: string;
  imageFile: string;
  website: string;
  twitter: string;
  tags: string[];
};

class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      showImgUpload: false,
      network: WalletAdapterNetwork.Devnet,
    } as any;
  }

  setMintAddress = (mint: string) => this.setState({ mintAddr: mint });
  setAssociatedAddress = (associatedAccount: string) =>
    this.setState({ associatedAccount });

  setNetwork = (network: WalletAdapterNetwork) => {
    this.setState({ network });
    console.log(network);
  };

  setPaymentContext = (wallet: WalletContextState, connection: Connection) =>
    this.setState({ wallet, connection });

  getPaymentProps = () => ({
    setPaymentContext: this.setPaymentContext,
  });

  onCreateNewToken = async () => {
    const { wallet, connection, tokenInfo } = this.state;
    if (!wallet || !connection) throw new WalletNotConnectedError('no pubkey');
    const { publicKey, sendTransaction, signTransaction } = wallet;

    if (!publicKey) throw new WalletNotConnectedError('no pubkey');
    if (!signTransaction)
      throw new WalletNotConnectedError('no sign transaction');

    // TODO propagate token info here
    const { transaction, associatedAddress, mintKeypair } =
      await createMintingTransaction({ publicKey, connection });

    const signature = await sendTransaction(transaction, connection, {
      signers: [mintKeypair],
    });

    await connection.confirmTransaction(signature, 'processed');

    this.setAssociatedAddress(associatedAddress.toBase58());
    this.setMintAddress(mintKeypair.publicKey.toBase58());

    const token = this.isTokenValid();
    if (!token) throw new Error('Invalid token');

    const image = {
      url: tokenInfo!.imageUrl,
    };
    await PullRequester.makePR(token, image);
  };

  isTokenValid() {
    const { mintAddr, associatedAccount, wallet, tokenInfo } = this.state;
    const owner = wallet!.publicKey!;
    if (!tokenInfo) throw new Error('No token info');

    const extensions = {
      website: tokenInfo.website,
      twitter: tokenInfo.twitter,
    };

    const tags = tokenInfo.tags.length ? tokenInfo.tags : undefined;

    const token: TokenInfo = {
      chainId: 101,
      address: mintAddr!,
      name: tokenInfo.name,
      decimals: tokenInfo.decimals,
      symbol: tokenInfo.symbol,
      logoURI: tokenInfo.imageUrl, // TODO construct url for uploaded file
      extensions,
      tags,
    };
    const result = defineTokenForListing(token);
    if (typeof result === 'string') {
      return undefined;
    }

    return result;
  }

  render() {
    const { network } = this.state;
    return (
      <div className="App">
        <header>
          <NetworkSelector
            setNetwork={this.setNetwork}
            currentNetwork={network}
          ></NetworkSelector>
        </header>
        <main className="App-body">
          <Wallet network={network} payment={this.getPaymentProps()}>
            <TokenForm onSubmit={this.onCreateNewToken}></TokenForm>
          </Wallet>
        </main>
        <footer>
          <img src={logo} className="App-logo" alt="logo" />
          <p>🚀StreamFlow Token Minter🚀</p>
        </footer>
      </div>
    );
  }
}

function NetworkSelector(props: {
  currentNetwork: WalletAdapterNetwork;
  setNetwork: (net: WalletAdapterNetwork) => void;
}) {
  return (
    <DropdownButton title={props.currentNetwork}>
      <Dropdown.Item
        onClick={() => props.setNetwork(WalletAdapterNetwork.Devnet)}
      >
        DevNet
      </Dropdown.Item>
      <Dropdown.Item
        onClick={() => props.setNetwork(WalletAdapterNetwork.Testnet)}
      >
        TestNet
      </Dropdown.Item>
      <Dropdown.Item
        onClick={() => props.setNetwork(WalletAdapterNetwork.Mainnet)}
      >
        MainNet
      </Dropdown.Item>
    </DropdownButton>
  );
}

function MintFields(props?: MintInfo) {
  if (!props) return null;
  return (
    <div>
      <Info
        label="Token Mint Authority"
        value={props.mintAuthority?.toBase58()}
        isLink
      />
      <Info label="Token Decimals" value={props.decimals} />
      <Info
        label="Total Supply"
        value={props.supply.toNumber() / 10 ** props.decimals}
      />
    </div>
  );
}

function AccountFields(props: IAccountState & { decimals?: number }) {
  if (!props) return null;
  return (
    <div>
      <Info label="Public Key" value={props.publicKey} isLink />
      <Info label="Private Key" value={props.privateKey} />
      <Info label="Sub-Wallet" value={props.subWalletKey} isLink />
      <Info
        label="Sub-Wallet Balance"
        value={
          props.subWalletBalance
            ? props.subWalletBalance / 10 ** (props.decimals || 0)
            : undefined
        }
      />
    </div>
  );
}

function Info(props: {
  label: string;
  value?: string | number;
  isLink?: boolean;
}) {
  const { label, value, isLink } = props;
  if (!value) return null;

  return (
    <div>
      {isLink ? (
        <label htmlFor={label}>
          <ExplorerLabel address={value as string} label={label} />
        </label>
      ) : (
        <label htmlFor={label}>{label}</label>
      )}
      <input type="text" name={label} value={value} readOnly={true} />
    </div>
  );
}

function ExplorerLabel(props: { address: string; label: string }) {
  return (
    <a
      className="App-link"
      href={explorerLink(props.address)}
      target="_blank"
      rel="noopener noreferrer"
    >
      {props.label}
    </a>
  );
}

export default App;
