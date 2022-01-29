import { useReducer } from 'react';
import logo from './imgs/solana-sol-logo.svg';
import './App.css';
import {
  AppState,
  defaultAppState,
  explorerLink,
  IAccountState,
  SetStateParam,
} from './types';
import { MintInfo } from '@solana/spl-token';
import { StepProgressBar } from './ProgressSteps';
import { Wallet } from './walletAdapter';

import * as x from './github';
import { makePR } from './PrMaker';
x.defineTokenListing({});
makePR(false);

const reducer = (state: AppState, update: SetStateParam): AppState => {
  // support both object updates and update through callback
  let newState = update;
  if (typeof update === 'function') {
    newState = update(state);
  }
  return { ...state, ...newState };
};

function App() {
  const [state, setState] = useReducer(reducer, defaultAppState);

  return (
    <div className="App">
      <header className="App-header">
        <Wallet>{/* <span> hi</span> */}</Wallet>
        <img src={logo} className="App-logo" alt="logo" />
        <p>🚀StreamFlow Token Minter🚀</p>
        <div>
          <StepProgressBar
            currentStep={state.currentSteps}
            totalSteps={state.totalSteps}
          />
          {/* <button type="button" onClick={() => startMinting(setState)}>
            Start minting!
          </button> */}
        </div>
      </header>
    </div>
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
