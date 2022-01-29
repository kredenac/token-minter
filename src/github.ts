import response from './tokenlist.json';
import { TokenList, TokenInfo } from '@uniswap/token-lists';

// import { Octokit } from '@octokit/core';

// const octokit = new Octokit({ auth: key }),
//   owner = 'test-user',
//   repo = 'test-repo',
//   title = 'My Test Pull Request',
//   body = 'This pull request is a test!',
//   head = 'my-feature-branch',
//   base = 'develop-branch';

// octokit.

export function defineTokenForListing(token: Partial<TokenInfo>): TokenInfo {
  const tokenList: TokenList = response;

  token = {
    chainId: 101,
    address: '777BxqxWsP5oqS84Pkja4wLxyZYsHzMivQbnfwFJQ777',
    symbol: 'TestSymbol',
    name: 'TestName',
    decimals: 4,
    logoURI:
      'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/3CaBxqxWsP5oqS84Pkja4wLxyZYsHzMivQbnfwFJQeL1/logo.png',
    tags: ['DeFi', 'social-token'],
    extensions: {
      twitter: 'https://twitter.com/solfina_io',
      website: 'https://solfina.io/',
    },
  };

  const newToken = createTokenForListing(token);
  validateToken(tokenList, newToken);

  return newToken;
}

function validateToken(tokenList: TokenList, newToken: TokenInfo) {
  let valid = true;

  if (newToken.name.length > 56) {
    console.log('name too long');
  }

  if (newToken.symbol.length > 21) {
    console.log('symbol too long');
  }

  if (!newToken?.extensions?.website) {
    console.log('website required');
  }

  const same = tokenList.tokens.find(
    (token) =>
      token.address === newToken.address ||
      token.name === newToken.name ||
      token.symbol === newToken.symbol
  );

  if (same) {
    console.log('not unique');
    return false;
  }

  if (valid) {
    console.log('Success - valid token!');
  } else {
    console.log('Failed validation:');
  }
}

function createTokenForListing(token: Partial<TokenInfo>): TokenInfo {
  return {
    chainId: 101,
    ...token,
    // TODO logo uri
  } as TokenInfo;
}
