export async function makePR(exec = true) {
  if (!exec) return;
  const response = await fetch(
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
        description: 'attempt 2',
        title: 'Add new token',
        commit: 'This is some commit description',
        files: [
          {
            path: 'README.md',
            content: 'Existing file',
          },
          {
            path: 'newREADME.md',
            content: 'New file',
          },
        ],
      }),
    }
  );

  console.log(response);
  console.log(JSON.stringify(response));
}

(window as any).makePR = makePR;
