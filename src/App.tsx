import { useEffect, useReducer } from 'react';
import logo from './imgs/logo.svg';
import './App.css';
import { startMinting } from './minting';
import { AppState, defaultAppState } from './types';

function App() {
  const [state, setState] = useReducer(
    (state: AppState, update: Partial<AppState>) => ({ ...state, ...update }),
    defaultAppState
  );

  useEffect(() => {
    startMinting(setState);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello and happy hacking!🔥</p>
        <p>
          <button
            type="button"
            onClick={() => setState({ count: state.count + 1 })}
          >
            Numbers go brrr {state.count}
          </button>

          <Info label="environment" value={state.environment} />
          <Info label="Token Mint Key" value={state.tokenPubKey} />
          <Info label="Owner Public Key" value={state.ownerPublicKey} />
          <Info label="Owner Private Key" value={state.ownerPrivateKey} />
          <Info label="Reciever Public Key" value={state.recieiverPublicKey} />
          <Info label="Owner Sub-Wallet" value={state.ownerSubWallet} />
          <Info label="Reciever Sub-Wallet" value={state.recieverSubWallet} />
        </p>

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

function Info(props: { label: string; value?: string }) {
  const { label, value } = props;
  if (!value) return null;
  return (
    <>
      <br />
      <label htmlFor={label}>{label}</label>
      <input
        type="text"
        name={label}
        value={value}
        readOnly={true}
        size={value.length + 3}
      />
    </>
  );
}

export default App;
