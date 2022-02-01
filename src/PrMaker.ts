import { TokenInfo } from '@uniswap/token-lists';

const prForUser = 'kredenac';

export type Image = {
  content?: string;
  ext?: string;
  url?: string;
};

export class PullRequester {
  /** Returns url where the pull request was created */
  static async makePR(token: TokenInfo, image: Image): Promise<string> {
    const file = await PullRequester.fetchTokenListFile();

    const fileUpdate = PullRequester.addTokenToFile(file, token);

    await PullRequester.makePullRequest(fileUpdate, image, token);

    return `https://github.com/${prForUser}/token-list/pulls`;
  }

  private static async fetchTokenListFile() {
    const response = await fetch(
      `https://raw.githubusercontent.com/${prForUser}/token-list/main/src/tokens/solana.tokenlist.json`
    );
    return await response.text();
  }

  private static addTokenToFile(file: string, token: TokenInfo): string {
    // Order of properties is important for auto-merger
    const orderedToken: TokenInfo = {
      chainId: token.chainId,
      address: token.address,
      symbol: token.symbol,
      name: token.name,
      decimals: token.decimals,
      logoURI: token.logoURI,
      tags: token.tags,
      extensions: token.extensions,
    };

    const lines = file.split('\n');
    const newLines = JSON.stringify(orderedToken, null, 2)
      .split('\n')
      .map((line) => '    ' + line);

    lines[lines.length - 8] += ',';
    lines.splice(lines.length - 7, 0, ...newLines);
    console.log(lines.slice(-45));

    return lines.join('\n');
  }

  public static getUploadedImagePath(tokenAddr: string) {
    const path = PullRequester.getImgPath(tokenAddr);
    return `https://raw.githubusercontent.com/solana-labs/token-list/main/${path}`;
  }

  private static getImgPath(tokenAddr: string) {
    return `assets/mainnet/${tokenAddr}/logo.svg`;
  }

  /** Lasts around 14 seconds */
  private static async makePullRequest(
    tokenList: string,
    image: Image,
    token: TokenInfo
  ) {
    const files = [
      {
        path: 'src/tokens/solana.tokenlist.json',
        content: tokenList,
      },
    ];

    // If image url is given, no need to upload anything for the image
    if (image.content) {
      files.push({
        path: PullRequester.getImgPath(token.address),
        content: image.content,
      });
    }

    try {
      return await fetch(
        'https://xrbhog4g8g.execute-api.eu-west-2.amazonaws.com/prod/prb0t',
        {
          headers: {
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          method: 'POST',
          mode: 'no-cors',
          body: JSON.stringify({
            user: prForUser,
            repo: 'token-list',
            description: `Adding ${token.name} token on behalf of https://www.google.com`,
            title: `Listing ${token.symbol}`,
            commit: `Adding ${token.name} token on behalf of https://www.google.com`,
            files,
          }),
        }
      );
    } catch (error: unknown) {
      console.log('pr bot error');
      console.log(error);
    }
  }
}
