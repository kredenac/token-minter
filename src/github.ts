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

export function defineTokenListing(token: Partial<TokenInfo>) {
  const tokenList: TokenList = response;
  // const num = tokenList.tokens.length;
  // console.log('num', num);

  // const extensions = new Set(
  //   tokenList.tokens.flatMap((token) => Object.keys(token.extensions || {}))
  // );
  // console.log('extensions', extensions);

  // const tags = new Set(tokenList.tokens.flatMap((token) => token.tags || []));
  // console.log('tags', tags);

  // const chhainIds = new Set(tokenList.tokens.map((token) => token.chainId));
  // console.log('chhainIds', chhainIds);

  // const maxLength = Math.max(
  //   ...tokenList.tokens.map((token) => token.symbol.length)
  // );
  // console.log(
  //   'max symbol:',
  //   maxLength,
  //   tokenList.tokens.filter((token) => token.symbol.length === 21)
  // );

  const newToken = createTokenForListing(token);
  validateToken(tokenList, newToken);
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
    console.log('Success!');
  } else {
    console.log('Failed validation:');
  }
}

function createTokenForListing(token: Partial<TokenInfo>): TokenInfo {
  return {
    chainId: 101,
    ...token,
  } as TokenInfo;
}
