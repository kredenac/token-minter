import { useState } from "react";
import logo from "./imgs/logo.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello and happy hacking!🔥</p>
        <p>
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            Numbers go brrr {count}
          </button>
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
          {" | "}
          <a
            className="App-link"
            href="https://www.spl-token-ui.com/#/"
            target="_blank"
            rel="noopener noreferrer"
          >
            SPL Token UI
          </a>
        </p>
      </header>
    </div>
  );
}

export default App;
