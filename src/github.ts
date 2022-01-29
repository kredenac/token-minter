import keys from '../devnetkeys.json';

const key = keys.github;

import response from './tokenlist.json';
import { TokenList, schema, TokenInfo } from '@uniswap/token-lists';

// import { Octokit } from '@octokit/core';

// const octokit = new Octokit({ auth: key }),
//   owner = 'test-user',
//   repo = 'test-repo',
//   title = 'My Test Pull Request',
//   body = 'This pull request is a test!',
//   head = 'my-feature-branch',
//   base = 'develop-branch';

// octokit.

export function lmao() {
  const tokenList: TokenList = response;
  const num = tokenList.tokens.length;
  console.log('num', num);

  const extensions = new Set(
    tokenList.tokens.flatMap((token) => Object.keys(token.extensions || {}))
  );
  console.log('extensions', extensions);

  const tags = new Set(tokenList.tokens.flatMap((token) => token.tags || []));
  console.log('tags', tags);

  const chhainIds = new Set(tokenList.tokens.map((token) => token.chainId));
  console.log('chhainIds', chhainIds);

  const newToken = createTokenForListing();
  validateToken(tokenList, newToken);
}

function validateToken(tokenList: TokenList, token: TokenInfo) {
  // tokenList.tokens.push(token);
  const ajv = new Ajv({ allErrors: true });
  addFormats(ajv);
  const validate = ajv.compile(schema);

  const validationResult = validate(tokenList);
  if (validationResult) {
    console.log('Success!');
  } else {
    console.log('Failed validation:', validate.errors);
  }
}

function createTokenForListing(): TokenInfo {
  return {
    chainId: 101,
    address: 'zz',
    decimals: 'a' as any,
    name: 'Wrapped SOL',
    symbol: 'SOL',
    logoURI: '',
    tags: ['tag'],
    extensions: { twitter: '', haha: 3 },
  };
}
