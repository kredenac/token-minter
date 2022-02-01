import response from './tokenlist.json';
import { TokenList, TokenInfo } from '@uniswap/token-lists';

/** Returns error string if failed */
export function defineTokenForListing(
  token: Omit<TokenInfo, 'chainId'>
): TokenInfo | string {
  const tokenList: TokenList = response;

  const newToken: TokenInfo = { chainId: 101, ...token };

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
