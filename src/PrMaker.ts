import { TokenInfo } from '@uniswap/token-lists';
import { defineTokenForListing } from './github';

export class PullRequester {
  static async makePR(exec = true) {
    if (!exec) return;

    const file = await PullRequester.fetchTokenListFile();
    const token = defineTokenForListing(null as any);

    const fileUpdate = PullRequester.addTokenToFile(file, token);

    const response = await PullRequester.makePullRequest(
      fileUpdate,
      'imgcontent',
      token
    );
  }

  static async fetchTokenListFile() {
    const response = await fetch(
      'https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json'
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

  static async makePullRequest(
    tokenList: string,
    imgContent: string,
    token: TokenInfo
  ) {
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
          user: 'kredenac',
          repo: 'token-list',
          description: 'serious attempt',
          title: 'Add new token',
          commit: 'This is some commit description',
          files: [
            {
              path: './src/tokens/solana.tokenlist.json',
              content: tokenList,
            },
            {
              path: `./assets/mainnet/${token.address}/logo.png`,
              content: imgContent,
            },
          ],
        }),
      }
    );
  }
}

(window as any).makePR = PullRequester.makePR;
(window as any).fetchTokenList = PullRequester.fetchTokenListFile;
