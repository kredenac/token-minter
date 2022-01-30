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

    // todo try catch
    console.time('bot');
    const response = await PullRequester.makePullRequest(
      fileUpdate,
      image,
      token
    );
    console.timeEnd('bot');

    console.log('bot response', response);
    return `https://github.com/${prForUser}/token-list/pulls`;
  }

  private static async fetchTokenListFile() {
    const response = await fetch(
      `https://raw.githubusercontent.com/${prForUser}/token-list/main/src/tokens/solana.tokenlist.json`
    );
    return await response.text();
  }

  private static addTokenToFile(file: string, token: TokenInfo): string {
    const lines = file.split('\n');

    const newLines = JSON.stringify(token, null, 2)
      .split('\n')
      .map((line) => '    ' + line);

    lines[lines.length - 8] += ',';
    lines.splice(lines.length - 7, 0, ...newLines);
    console.log(lines.slice(-45));

    return lines.join('\n');
  }

  /** Lasts around 14 seconds, need to show spinner */
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
        path: `assets/mainnet/${token.address}/logo.${image.ext}`,
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
      ).catch((error) => console.log('catch error:', error));
    } catch (error: unknown) {
      console.log('pr bot error');
      console.log(error);
    }
  }
}

(window as any).makePR = PullRequester.makePR;
// (window as any).fetchTokenList = PullRequester.fetchTokenListFile;
