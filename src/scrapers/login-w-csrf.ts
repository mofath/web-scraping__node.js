import * as cheerio from 'cheerio';
import * as requestPromise from 'request-promise';

(async () => {
  const headers = {
    authority: 'quotes.toscrape.com',
    accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-US,en;q=0.9,fr;q=0.8',
    'upgrade-insecure-requests': 1,
  };

  try {
    // initial request to get CSRF
    const initialRequest = await requestPromise.get({
      uri: 'https://quotes.toscrape.com/login',
      resolveWithFullResponse: true,
      headers,
      gzip: true,
    });

    // Parsing the cookies
    let [cookie] = initialRequest.headers['set-cookie'].map(
      (val) => val.split(';')[0]
    );
    const $ = cheerio.load(initialRequest.body);

    const csrfToken = $('input[name="csrf_token"]').val();

    // login request
    await requestPromise.post({
      uri: 'https://quotes.toscrape.com/login',
      headers: {
        ...headers,
        Cookie: cookie,
      },
      form: {
        csrf_token: csrfToken,
        username: 'admin',
        password: 'admin',
      },
      resolveWithFullResponse: true,
      gzip: true,
    });
  } catch (error: any) {
    const [authCookie] = error.response.headers['set-cookie'].map((val) => val.split(';')[0]);

    const authenticatedUserRequest = await requestPromise.get({
        uri: 'https://quotes.toscrape.com',
        resolveWithFullResponse: true,
        headers:{
            ...headers,
            Cookie: authCookie
        },
        gzip: true,
      });

    console.log(authenticatedUserRequest);
  }
})();
