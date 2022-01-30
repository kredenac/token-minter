import logo from './imgs/solana-sol-logo.svg';
import './App.css';
import { explorerLink, IAccountState } from './types';
import { MintInfo } from '@solana/spl-token';
import { Wallet } from './walletAdapter';
import React from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { Dropdown, DropdownButton } from 'react-bootstrap';

export type AppState = {
  tokenPubKey?: string;
  network: WalletAdapterNetwork;
  mintInfo?: MintInfo;
  // totalSteps: number;
  // currentSteps: number;
};

class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      showImgUpload: false,
      network: WalletAdapterNetwork.Devnet,
    } as any;
  }

  setNetwork = (network: WalletAdapterNetwork) => {
    this.setState({ network });
    console.log(network);
  };

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
          <Wallet network={network}></Wallet>
          <div>
            {/* <StepProgressBar
              currentStep={state.currentSteps}
              totalSteps={state.totalSteps}
            /> */}
            {/* <button type="button" onClick={() => startMinting(setState)}>
            Start minting!
          </button> */}
          </div>
          {/* <TokenForm onSumbmit={() => console.log('top submit')}></TokenForm> */}
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
