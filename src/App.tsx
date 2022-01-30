import logo from './imgs/solana-sol-logo.svg';
import './App.css';
import { Wallet } from './walletAdapter';
import React from 'react';
import {
  WalletAdapterNetwork,
  WalletNotConnectedError,
} from '@solana/wallet-adapter-base';
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';
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
    this.setState({ tokenInfo: newTokenInfo }, this.onCreateNewToken);
  };

  onCreateNewToken = async () => {
    this.setState({ uxState: 'loading' });
    const { wallet, connection, tokenInfo } = this.state;

    if (!wallet || !connection)
      throw new WalletNotConnectedError('no connection');
    const { publicKey, sendTransaction, signTransaction } = wallet;

    if (!publicKey) throw new WalletNotConnectedError('no pubkey');
    if (!signTransaction || !tokenInfo)
      throw new WalletNotConnectedError('no sign transaction');

    const { transaction, associatedAddress, mintKeypair } =
      await createMintingTransaction({
        publicKey,
        connection,
        amount: tokenInfo.supply,
        decimals: tokenInfo.decimals,
      });

    const mintAddr = mintKeypair.publicKey.toBase58();
    const token = this.isTokenValid(mintAddr);
    if (!token || typeof token === 'string') {
      this.setState({
        errorLog: 'Token is invalid and will not be created:' + token,
      });
      return;
    }

    let signature = '';
    try {
      signature = await sendTransaction(transaction, connection, {
        signers: [mintKeypair],
      });
    } catch (e: any) {
      this.setState({
        errorLog: 'Token creation transaction failed: ' + e.message,
      });
      return;
    }

    this.setAssociatedAddress(associatedAddress.toBase58());
    this.setMintAddress(mintAddr);

    try {
      await connection.confirmTransaction(signature, 'processed');
    } catch (e: any) {
      this.setState({
        errorLog: 'Token transaction confirmation failed: ' + e.message,
      });
      return;
    }

    const image = {
      url: tokenInfo!.imageUrl,
    };
    // TODO have some timeout
    const prUrl = await PullRequester.makePR(token, image);
    this.setState({ prUrl, uxState: 'done' });
  };

  isTokenValid(mintAddr: string) {
    const { tokenInfo } = this.state;
    if (!tokenInfo) throw new Error('No token info');

    const extensions = {
      website: tokenInfo.website,
      twitter: tokenInfo.twitter,
    };
    if (!extensions.twitter) delete extensions.twitter;

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
    return result;
  }

  render() {
    if (this.state.errorLog) {
      return <ErrorReport error={this.state.errorLog} />;
    }

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
            mintAddr={this.state.mintAddr}
            associatedAccount={this.state.associatedAccount}
            prLink={this.state.prUrl}
            uxState={this.state.uxState}
          />
          <Wallet network={network} payment={this.getPaymentProps()}>
            <div
              style={{
                display: this.state.uxState === 'loading' ? 'none' : 'auto',
              }}
            >
              <TokenForm onSubmit={this.onFormSuccessful} />
            </div>
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

function ErrorReport(props: { error?: string }) {
  if (!props.error) return null;
  return (
    <div>
      <p className="btn alert alert-danger h-2" role="alert">
        {'An error occurred: ' + props.error}
      </p>
      <br />
      <Button onClick={() => window.location.reload()}>Try again</Button>
    </div>
  );
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
