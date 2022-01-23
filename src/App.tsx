import { useEffect, useReducer } from 'react';
import logo from './imgs/logo.svg';
import './App.css';
import { startMinting } from './minting';
import {
  AppState,
  defaultAppState,
  IAccountState,
  SetStateParam,
} from './types';
import { MintInfo } from '@solana/spl-token';

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

  useEffect(() => {
    startMinting(setState);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello and happy hacking!🔥</p>
        <div>
          <button
            type="button"
            onClick={() => setState({ count: state.count + 1 })}
          >
            Numbers go brrr {state.count}
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
            <AccountFields {...state.owner} />
          </div>
          <div>
            <span>Reciever</span>
            <AccountFields {...state.reciever} />
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
      />
      <Info label="Token Decimals" value={props.decimals} />
      <Info label="Total Supply" value={props.supply.toNumber()} />
    </div>
  );
}

function AccountFields(props: IAccountState) {
  if (!props) return null;
  return (
    <div>
      <Info label="Public Key" value={props.publicKey} />
      <Info label="Private Key" value={props.privateKey} />
      <Info label="Sub-Wallet" value={props.subWalletKey} />
      <Info
        label="Sub-Wallet Balance"
        value={props.subWalletBalance?.toString()}
      />
    </div>
  );
}

function Info(props: { label: string; value?: string | number }) {
  const { label, value } = props;
  if (!value) return null;
  return (
    <div>
      <label htmlFor={label}>{label}</label>
      <input
        type="text"
        name={label}
        value={value}
        readOnly={true}
        // size={value.length + 3}
      />
    </div>
  );
}

export default App;
