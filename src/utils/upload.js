import Crypto from 'crypto'
import AWS from 'aws-sdk'
import fs from 'fs/promises'
import Config from '../config.js'
import Data from '@socious/data'
import { Storage } from '@google-cloud/storage'

const s3 = new AWS.S3()

const makeExtention = (contentType) => {
  switch (contentType) {
    case Data.MediaContentType.JPEG:
      return '.jpg'
    case Data.MediaContentType.PNG:
      return '.png'
    case Data.MediaContentType.PDF:
      return '.pdf'
    case Data.MediaContentType.DOC:
      return '.doc'
    case Data.MediaContentType.DOCX:
      return '.docx'
    default:
      throw Error('Unkown content type')
  }
}

async function uploadS3(file, contentType = Data.MediaContentType.JPEG) {
  const buffer = typeof file === 'string' ? await fs.readFile(file) : file
  const shasum = Crypto.createHash('md5')
  shasum.update(buffer)
  const filename = `${shasum.digest('hex')}${makeExtention(contentType)}`
  const params = {
    Bucket: Config.aws.bucket,
    Key: filename,
    Body: buffer,
    ContentType: contentType
  }

  await s3.putObject(params).promise()
  return `${Config.aws.cdn_url}/${filename}`
}

async function uploadGCS(file, contentType = Data.MediaContentType.JPEG) {
  const storage = new Storage({
    keyFilename: Config.gcs.credentials // Path to service account JSON file
  })
  
  const bucket = storage.bucket(Config.gcs.bucket)

  const buffer = typeof file === 'string' ? await fs.readFile(file) : file
  const shasum = Crypto.createHash('md5')
  shasum.update(buffer)
  const filename = `${shasum.digest('hex')}${makeExtention(contentType)}`
  
  const blob = bucket.file(filename)
  const blobStream = blob.createWriteStream({
    metadata: { contentType }
  })

  await new Promise((resolve, reject) => {
    blobStream.on('error', reject)
    blobStream.on('finish', resolve)
    blobStream.end(buffer)
  })

  return `${Config.gcs.cdn_url}/${filename}`
}

export default async (file, contentType = Data.MediaContentType.JPEG) => {
  console.log(Config.storageType)
  if(Config.storageType == 'AWS') {
    return await uploadS3(file, contentType)
  }else if(Config.storageType == 'GCS') {
    return await uploadGCS(file, contentType)
  }else {
    throw new Error('Unknown storage type')
  }
}
