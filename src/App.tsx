import logo from './imgs/solana-sol-logo.svg';
import './App.css';
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
import { BonusTokenInfo, TokenForm } from './TokenForm';
import { PullRequester } from './PrMaker';
import { Results } from './Results';
import { UxState } from './types';

export type AppState = {
  tokenPubKey?: string;
  network: WalletAdapterNetwork;
  mintAddr?: string;
  associatedAccount?: string;
  wallet?: WalletContextState;
  connection?: Connection;
  tokenInfo?: BonusTokenInfo;
  errorLog?: string;
  prUrl?: string;
  uxState: UxState;
};

class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      uxState: 'initial',
      network: WalletAdapterNetwork.Devnet,
    };
  }

  setMintAddress = (mint: string) => this.setState({ mintAddr: mint });
  setAssociatedAddress = (associatedAccount: string) =>
    this.setState({ associatedAccount });

  setNetwork = (network: WalletAdapterNetwork) => {
    this.setState({ network });
  };

  setPaymentContext = (wallet: WalletContextState, connection: Connection) =>
    this.setState({ wallet, connection });

  getPaymentProps = () => ({
    setPaymentContext: this.setPaymentContext,
  });

  onFormSuccessful = async (newTokenInfo: BonusTokenInfo) => {
    this.setState(
      { tokenInfo: newTokenInfo, uxState: 'loading' },
      this.onCreateNewToken
    );
  };

  onCreateNewToken = async () => {
    const { wallet, connection, tokenInfo } = this.state;

    if (!wallet || !connection) throw new WalletNotConnectedError('no pubkey');
    const { publicKey, sendTransaction, signTransaction } = wallet;

    if (!publicKey) throw new WalletNotConnectedError('no pubkey');
    if (!signTransaction)
      throw new WalletNotConnectedError('no sign transaction');

    if (Math.random()) return;

    // TODO propagate token info here
    const { transaction, associatedAddress, mintKeypair } =
      await createMintingTransaction({ publicKey, connection });

    const mintAddr = mintKeypair.publicKey.toBase58();
    const token = this.isTokenValid(mintAddr);
    if (!token) {
      this.setState({ errorLog: 'Token is invalid and will not be created' });
      return;
    }
    this.setAssociatedAddress(associatedAddress.toBase58());
    this.setMintAddress(mintAddr);

    const signature = await sendTransaction(transaction, connection, {
      signers: [mintKeypair],
    });

    try {
      await connection.confirmTransaction(signature, 'processed');
    } catch (e: any) {
      this.setState({ errorLog: 'Token creation failed: ' + e.message });
      return;
    }

    const image = {
      url: tokenInfo!.imageUrl,
    };
    const prUrl = await PullRequester.makePR(token, image);
    this.setState({ prUrl });
  };

  isTokenValid(mintAddr: string) {
    const { tokenInfo } = this.state;
    // const owner = wallet!.publicKey!;
    if (!tokenInfo) throw new Error('No token info');

    const extensions = {
      website: tokenInfo.website,
      twitter: tokenInfo.twitter,
    };

    const tags = tokenInfo.tags.length ? tokenInfo.tags : undefined;

    const token: TokenInfo = {
      chainId: 101,
      address: mintAddr,
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
          <Results
            mintAddr="asd"
            associatedAccount="123"
            prLink={'https://www.google.co'}
          />
          <Wallet network={network} payment={this.getPaymentProps()}>
            <TokenForm onSubmit={this.onFormSuccessful}></TokenForm>
          </Wallet>
          {this.state.errorLog && (
            <span className="btn alert alert-danger h-2" role="alert">
              {this.state.errorLog}
            </span>
          )}
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

export default App;
