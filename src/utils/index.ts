import * as request from 'request';
import fs from 'fs';

export const downloadFile = (
  url: string,
  headers: any,
  options: any,
  filename: string
) =>
  new Promise((resolve, reject) => {
    let file = fs.createWriteStream(filename);

    request.get({
      url: url,
      headers,
      ...options,
    })
      .pipe(file)
      .on('finish', () => {
        console.log('Download finished.');
        resolve(file);
      })
      .on('error', (error) => {
        console.log('Download failed.');
        reject(error);
      });
  });
