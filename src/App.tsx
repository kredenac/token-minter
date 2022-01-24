import { useReducer } from 'react';
import logo from './imgs/logo.svg';
import './App.css';
import { startMinting } from './minting';
import {
  AppState,
  defaultAppState,
  explorerLink,
  IAccountState,
  SetStateParam,
} from './types';
import { MintInfo } from '@solana/spl-token';
import { StepProgressBar } from './ProgressSteps';

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
        <StepProgressBar />
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello and happy hacking!🔥</p>
        <div>
          <button type="button" onClick={() => startMinting(setState)}>
            Start minting!
          </button>
        </div>

        <div className="wrapper">
          <div>
            <Info label="Environment" value={state.environment} />
            <Info label="Token Mint Key" value={state.tokenPubKey} />
            {state.mintInfo && <MintFields {...state.mintInfo} />}
          </div>
          <div>
            <span>Owner</span>
            <AccountFields
              {...state.owner}
              decimals={state.mintInfo?.decimals}
            />
          </div>
          <div>
            <span>Reciever</span>
            <AccountFields
              {...state.reciever}
              decimals={state.mintInfo?.decimals}
            />
          </div>
        </div>

        <p>
          <a
            className="App-link"
            href="https://solana-labs.github.io/solana-web3.js/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Solana Web3
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://www.spl-token-ui.com/#/"
            target="_blank"
            rel="noopener noreferrer"
          >
            SPL Token App
          </a>
          <br />
          <a
            className="App-link"
            href="https://github.com/paul-schaaf/spl-token-ui/blob/main/src/components/tokens/TokenCreator.vue"
            target="_blank"
            rel="noopener noreferrer"
          >
            SPL Token Code
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://explorer.solana.com/?cluster=devnet"
            target="_blank"
            rel="noopener noreferrer"
          >
            Solana explorer
          </a>
        </p>
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
