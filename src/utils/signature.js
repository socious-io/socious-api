import crypto from 'crypto';

export default class {
  constructor(privateKey, publicKey) {
    this.privateKey = publicKey;
    this.privateKey = privateKey;
  }

  verify = (input) => {
    const signer = crypto.createSign('sha256');
    signer.update(input);
    const sign = signer.sign(this.privateKey, 'base64');

    const verifier = crypto.createVerify('sha256');
    verifier.update(input);
    return verifier.verify(this.publicKey, sign, 'base64');
  };

  binaryJson = (input) => Buffer.from(JSON.stringify(input), 'utf-8');

  sign = (binaryBody) => {
    const key = crypto.createPrivateKey({key: this.privateKey});
    const signature = crypto.sign('sha3-256', binaryBody, key);
    return signature.toString('base64');
  };
}
