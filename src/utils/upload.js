import Crypto from 'crypto';
import AWS from 'aws-sdk';
import fs from 'fs/promises';
import Config from '../config.js';

const s3 = new AWS.S3();

export const ContentTypes = {
  JPEG: 'image/jpeg',
  PNG: 'image/png',
  PDF: 'application/pdf',
};

const makeExtention = (contentType) => {
  switch (contentType) {
    case ContentTypes.JPEG:
      return '.jpg';
    case ContentTypes.PNG:
      return '.png';
    case ContentTypes.PDF:
      return '.pdf';
    default:
      throw Error('Unkown content type');
  }
};

export default async (file, contentType = ContentTypes.JPEG) => {
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
