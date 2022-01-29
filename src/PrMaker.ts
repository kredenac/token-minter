import { TokenInfo } from '@uniswap/token-lists';
import { defineTokenForListing } from './github';

const prForUser = 'kredenac';

export class PullRequester {
  static async makePR(imgContent: string, imgExt: string) {
    const file = await PullRequester.fetchTokenListFile();
    const token = defineTokenForListing(null as any);

    const fileUpdate = PullRequester.addTokenToFile(file, token);

    // todo try catch
    console.time('bot');
    const response = await PullRequester.makePullRequest(
      fileUpdate,
      imgContent,
      imgExt,
      token
    );
    console.timeEnd('bot');

    console.log('bot response', response);
  }

  static async fetchTokenListFile() {
    const response = await fetch(
      `https://raw.githubusercontent.com/${prForUser}/token-list/main/src/tokens/solana.tokenlist.json`
    );
    return await response.text();
  }

  static addTokenToFile(file: string, token: TokenInfo): string {
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
  static async makePullRequest(
    tokenList: string,
    imgContent: string,
    imgExt: string,
    token: TokenInfo
  ) {
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
            description: 'serious attempt',
            title: `Listing ${token.symbol}`,
            commit: `Adding ${token.name} token on behalf of https://www.google.com`,
            files: [
              {
                path: 'src/tokens/solana.tokenlist.json',
                content: tokenList,
              },
              {
                path: `assets/mainnet/${token.address}/logo.${imgExt}`,
                content: imgContent,
              },
            ],
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
(window as any).fetchTokenList = PullRequester.fetchTokenListFile;
