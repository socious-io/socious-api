import Crypto from 'crypto';
import AWS from 'aws-sdk';
import fs from 'fs/promises';
import Config from '../config.js';
import Data from '@socious/data'


const s3 = new AWS.S3();



const makeExtention = (contentType) => {
  switch (contentType) {
    case Data.MediaContentType.JPEG:
      return '.jpg';
    case Data.MediaContentType.PNG:
      return '.png';
    case Data.MediaContentType.PDF:
      return '.pdf';
    default:
      throw Error('Unkown content type');
  }
};

export default async (file, contentType = Data.MediaContentType.JPEG) => {
  const buffer = typeof file === 'string' ? await fs.readFile(file) : file;
  const shasum = Crypto.createHash('md5');
  shasum.update(buffer);
  const filename = `${shasum.digest('hex')}${makeExtention(contentType)}`;
  const params = {
    Bucket: Config.aws.bucket,
    Key: filename,
    Body: buffer,
    ContentType: contentType,
  };

  await s3.putObject(params).promise();
  return `${Config.aws.cdn_url}/${filename}`;
};
