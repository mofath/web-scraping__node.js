import fs from 'fs';
import * as cheerio from 'cheerio';
import * as requestPromise from 'request-promise';
import { logger } from '../lib';
import { downloadFile } from '../utils';

const movies = [
  {
    url: 'https://www.imdb.com/title/tt0102926',
    id: 'silence-of-the-lambs',
  },
  {
    url: 'https://www.imdb.com/title/tt0110357',
    id: 'lion-king',
  },
];

const headers = {
  accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
  'accept-encoding': 'gzip, deflate, br',
  'accept-language': 'en-US,en;q=0.9,fr;q=0.8',
  'cache-control': 'max-age=0',
  'user-agent':
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36',
};

const options = { gzip: true };

const fetchMovie = async (movie: any) => {  
  try {
    const response = await requestPromise.get({
      uri: movie.url,
      headers,
      ...options,
    });

    const $ = cheerio.load(response);

    const title = $(`div[class="TitleBlock__TitleContainer-sc-1nlhx7j-1 jxsVNt"] > h1`).text();
    const rating = $(`span[class="AggregateRatingButton__RatingScore-sc-1ll29m0-1 iTLWoV"]`).text();
    const poster = $(`div[class="ipc-media ipc-media--poster-27x40 ipc-image-media-ratio--poster-27x40 ipc-media--baseAlt ipc-media--poster-l ipc-poster__poster-image ipc-media__img"] > img`).attr('src');
    const genres = $(`a[href^="/search/title/?genres"]`)
      .map((i, el) => $(el).text())
      .toArray();

   const file: any= await downloadFile(
      poster as string,
      headers,
      options,
      `${movie.id}.jpg`
    );

    return {
      title,
      rating,
      poster,
      genres,
      filename: file.filename
    };
  } catch (error) {
    logger.error(error);
  }
};

const fetchMoives = async () => {
  try {
    const moviesData = await Promise.all(
      movies.map((movie) => fetchMovie(movie))
    );

    return fs.writeFile(
      './src/data/imdb/imdb-data.json',
      JSON.stringify(moviesData),
      'utf8',
      (err) => {
        if (err) throw err;
        console.log('The file was saved!');
      }
    );
  } catch (error) {
    logger.error(error);
  }
};

fetchMoives();
