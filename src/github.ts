import response from './tokenlist.json';
import { TokenList, TokenInfo } from '@uniswap/token-lists';

/** Returns error string if failed */
export function defineTokenForListing(
  token: Partial<TokenInfo>
): TokenInfo | string {
  const tokenList: TokenList = response;

  token = { chainId: 101, ...token };

  const newToken = createTokenForListing(token);
  const hasError = validateToken(tokenList, newToken);
  if (hasError) return hasError;

  return newToken;
}

function validateToken(
  tokenList: TokenList,
  newToken: TokenInfo
): string | undefined {
  if (newToken.name.length > 56) {
    return 'name too long';
  }

  if (newToken.symbol.length > 21) {
    return 'symbol too long';
  }

  if (!newToken?.extensions?.website) {
    return 'website required';
  }

  const same = tokenList.tokens.find(
    (token) =>
      token.address === newToken.address ||
      token.name === newToken.name ||
      token.symbol === newToken.symbol
  );

  if (same) {
    return 'Token with same address, name or symbol already exists';
  }
}

function createTokenForListing(token: Partial<TokenInfo>): TokenInfo {
  return {
    chainId: 101,
    ...token,
    // TODO logo uri
  } as TokenInfo;
}
